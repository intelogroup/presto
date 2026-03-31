const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const { extractFaceTrack } = require("./faceTrack");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

/**
 * Probes a media file for duration and video stream presence via ffprobe.
 * @param {string} mediaPath
 * @returns {Promise<{ frames: number, duration: number, hasVideo: boolean }>}
 */
async function getMediaInfo(mediaPath) {
  return new Promise((resolve, reject) => {
    execFile(
      "ffprobe",
      [
        "-v", "error",
        "-show_streams",
        "-show_format",
        "-of", "json",
        mediaPath,
      ],
      { timeout: 30 * 1000 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(`ffprobe failed: ${stderr}`));
        const info = JSON.parse(stdout);

        const duration = parseFloat(
          (info.format && info.format.duration) || "0"
        );
        const videoStream =
          info.streams &&
          info.streams.find((s) => s.codec_type === "video");
        const hasVideo = !!videoStream;
        const frames = Math.round(duration * 30);

        resolve({ frames, duration, hasVideo });
      }
    );
  });
}

/**
 * Adjusts last slide duration to absorb rounding drift, copies video to public/.
 * @param {object} params
 * @param {Array<object>} params.slides - slides from generateSlides (with _segmentStart/_segmentEnd)
 * @param {string} params.videoPath - path to uploaded media file (video or audio)
 * @param {string} params.compositionId - from generateSlides
 * @param {string} params.jobId
 * @returns {{ compositionId, inputProps: { slides, talkingHeadSrc?, faceTrack? }, talkingHeadPublicPath: string|null }}
 */
async function syncTalkingHead({ slides, videoPath, compositionId, jobId, transitionFrames = 20 }) {
  const { frames: totalVideoFrames, hasVideo } = await getMediaInfo(videoPath);

  // Strip internal _segmentStart/_segmentEnd from slides
  const cleanSlides = slides.map(({ _segmentStart, _segmentEnd, ...rest }) => rest);

  const sumOfFrames = cleanSlides.reduce((sum, s) => sum + s.duration, 0);

  // TransitionSeries subtracts (n-1)*transitionFrames from the composition duration.
  // Our slide durations already include +transitionFrames on each intermediate slide,
  // so effectiveTotalFrames = totalVideoFrames + (n-1)*transitionFrames is what we
  // need the sum to equal so that after the subtraction we get exactly totalVideoFrames.
  const numTransitions = Math.max(0, cleanSlides.length - 1);
  const effectiveTotalFrames = totalVideoFrames + numTransitions * transitionFrames;
  let drift = effectiveTotalFrames - sumOfFrames;

  if (Math.abs(drift) > 90) {
    console.warn(`[syncTalkingHead] large drift detected: ${drift} frames (${(drift / 30).toFixed(1)}s) — absorbing into last slide`);
  }

  // Absorb drift into the last slide only. With the "next-slide-start" duration formula in
  // generateSlides.js, the only remaining drift is time after the speaker's last word to the
  // actual video end (ambient noise, silence, etc.). Extending the last slide is the correct
  // fix — the last slide holds on screen until the video finishes.
  const lastIdx = cleanSlides.length - 1;
  const newLastDuration = cleanSlides[lastIdx].duration + drift;
  if (newLastDuration >= 60) {
    cleanSlides[lastIdx].duration = newLastDuration;
  } else {
    // Edge case: shrinking last slide below minimum — distribute remaining frames evenly
    cleanSlides[lastIdx].duration = 60;
    let remaining = newLastDuration - 60;
    for (let i = lastIdx - 1; i >= 0 && remaining !== 0; i--) {
      const step = Math.sign(remaining);
      const candidate = cleanSlides[i].duration + step;
      if (candidate >= 60) {
        cleanSlides[i].duration = candidate;
        remaining -= step;
      }
    }
    if (remaining !== 0) {
      console.warn(`[syncTalkingHead] unresolvable drift: ${remaining} frames could not be redistributed across slides`);
    }
  }

  if (hasVideo) {
    // Sanitize jobId to alphanumeric+dash only before using in a path
    // Truncate to 200 chars to stay well within filesystem 255-char filename limit
    const safeJobId = jobId.replace(/[^a-zA-Z0-9\-]/g, "_").slice(0, 200);
    const talkingHeadFilename = `${safeJobId}_talkinghead.mp4`;
    const talkingHeadPublicPath = path.join(PUBLIC_DIR, talkingHeadFilename);
    // Confirm the resolved path stays inside PUBLIC_DIR (defense-in-depth)
    if (!talkingHeadPublicPath.startsWith(PUBLIC_DIR + path.sep) && talkingHeadPublicPath !== PUBLIC_DIR) {
      throw new Error("Path traversal detected in jobId");
    }
    // Run face tracking and video copy in parallel
    const [faceTrack] = await Promise.all([
      extractFaceTrack(videoPath).catch((err) => {
        console.warn(`[syncTalkingHead] face tracking failed (falling back to center): ${err.message}`);
        return undefined; // graceful degradation — TalkingHead defaults to center
      }),
      fs.promises.copyFile(videoPath, talkingHeadPublicPath),
    ]);

    return {
      compositionId,
      inputProps: {
        slides: cleanSlides,
        talkingHeadSrc: talkingHeadFilename,
        ...(faceTrack && faceTrack.length > 0 ? { faceTrack } : {}),
      },
      talkingHeadPublicPath,
    };
  }

  // Audio-only: no face tracking, no video copy
  return {
    compositionId,
    inputProps: {
      slides: cleanSlides,
    },
    talkingHeadPublicPath: null,
  };
}

module.exports = { syncTalkingHead };
