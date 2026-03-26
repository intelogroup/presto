/**
 * preprocess.js — Trim long silences from uploaded videos.
 *
 * Detects silent segments (>4s by default) using ffmpeg's silencedetect filter,
 * then produces a trimmed video that keeps only ~0.5s of each silence gap.
 * This runs as the FIRST pipeline step, before transcription.
 *
 * Why: Training/course videos often contain 3-5 minutes of dead air (pauses,
 * sneezing, coughing, note-flipping). Trimming before the pipeline means:
 *   - Whisper transcribes less audio (faster + cheaper)
 *   - GPT gets a cleaner transcript (better slides)
 *   - Remotion renders fewer frames (faster render)
 *   - User gets a tighter, more professional presentation
 */

const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Detect silent segments in a video using ffmpeg silencedetect.
 *
 * @param {string} videoPath
 * @param {object} [options]
 * @param {number} [options.silenceThresholdDb=-30] - dB threshold below which audio is "silent"
 * @param {number} [options.minSilenceDuration=4] - minimum silence duration in seconds to detect
 * @returns {Promise<Array<{ start: number, end: number }>>} silent segments
 */
async function detectSilences(videoPath, options = {}) {
  const { silenceThresholdDb = -30, minSilenceDuration = 4 } = options;

  return new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-i", videoPath,
        "-af", `silencedetect=noise=${silenceThresholdDb}dB:d=${minSilenceDuration}`,
        "-f", "null", "-",
      ],
      { timeout: 5 * 60 * 1000 },
      (err, _stdout, stderr) => {
        // ffmpeg writes silencedetect output to stderr (this is normal)
        // It also exits with 0 on success, but the error object may still be set
        // if there are warnings. We parse stderr regardless.
        const output = stderr || "";

        const silences = [];
        const startRegex = /silence_start:\s*([\d.]+)/g;
        const endRegex = /silence_end:\s*([\d.]+)/g;

        const starts = [];
        const ends = [];
        let match;

        while ((match = startRegex.exec(output)) !== null) {
          starts.push(parseFloat(match[1]));
        }
        while ((match = endRegex.exec(output)) !== null) {
          ends.push(parseFloat(match[1]));
        }

        // Pair up starts and ends
        for (let i = 0; i < starts.length; i++) {
          silences.push({
            start: starts[i],
            end: i < ends.length ? ends[i] : Infinity, // silence extends to end of video
          });
        }

        if (err && silences.length === 0) {
          return reject(new Error(`silencedetect failed: ${output.slice(-500)}`));
        }

        resolve(silences);
      }
    );
  });
}

/**
 * Get video duration in seconds via ffprobe.
 */
async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    execFile(
      "ffprobe",
      [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        videoPath,
      ],
      { timeout: 30 * 1000 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(`ffprobe failed: ${stderr}`));
        resolve(parseFloat(stdout.trim()));
      }
    );
  });
}

/**
 * Build the list of segments to KEEP, given silent segments to trim.
 * Each silence >minDuration is trimmed down to `keepDuration` seconds.
 *
 * @param {number} totalDuration - video duration in seconds
 * @param {Array<{ start: number, end: number }>} silences - detected silent segments
 * @param {number} keepDuration - how much silence to preserve (default 0.5s)
 * @returns {Array<{ start: number, end: number }>} segments to keep
 */
function buildKeepSegments(totalDuration, silences, keepDuration = 0.5) {
  if (silences.length === 0) {
    return [{ start: 0, end: totalDuration }];
  }

  const segments = [];
  let cursor = 0;

  for (const silence of silences) {
    // Keep everything from cursor to start of silence + half of keepDuration
    const silenceStart = silence.start;
    const silenceEnd = Math.min(silence.end, totalDuration);

    if (silenceStart > cursor) {
      // Add the non-silent segment + a tiny bit of the silence for natural pacing
      segments.push({
        start: cursor,
        end: Math.min(silenceStart + keepDuration / 2, silenceEnd),
      });
    }

    // Skip most of the silence, resume just before it ends
    cursor = Math.max(silenceEnd - keepDuration / 2, silenceStart + keepDuration / 2);
  }

  // Add the remaining segment after the last silence
  if (cursor < totalDuration) {
    segments.push({ start: cursor, end: totalDuration });
  }

  return segments.filter((s) => s.end - s.start > 0.05); // drop tiny fragments
}

/**
 * Generate a concat file for ffmpeg from keep segments.
 * Uses the "trim + concat" approach: each segment is extracted and concatenated.
 */
function buildComplexFilter(segments) {
  const filters = [];
  const concatInputs = [];

  segments.forEach((seg, i) => {
    const start = seg.start.toFixed(4);
    const duration = (seg.end - seg.start).toFixed(4);
    filters.push(`[0:v]trim=start=${start}:duration=${duration},setpts=PTS-STARTPTS[v${i}]`);
    filters.push(`[0:a]atrim=start=${start}:duration=${duration},asetpts=PTS-STARTPTS[a${i}]`);
    concatInputs.push(`[v${i}][a${i}]`);
  });

  const concatFilter = `${concatInputs.join("")}concat=n=${segments.length}:v=1:a=1[outv][outa]`;
  filters.push(concatFilter);

  return filters.join(";");
}

/**
 * Main entry point: preprocess a video by trimming long silences.
 *
 * @param {string} videoPath - absolute path to input video
 * @param {string} outputPath - absolute path for trimmed output video
 * @param {object} [options]
 * @param {number} [options.silenceThresholdDb=-30] - dB threshold for silence detection
 * @param {number} [options.minSilenceDuration=4] - minimum silence to detect (seconds)
 * @param {number} [options.keepDuration=0.5] - how much silence to keep (seconds)
 * @returns {Promise<{ trimmed: boolean, originalDuration: number, trimmedDuration: number, silencesFound: number, outputPath: string }>}
 */
async function preprocessVideo(videoPath, outputPath, options = {}) {
  const {
    silenceThresholdDb = -30,
    minSilenceDuration = 4,
    keepDuration = 0.5,
  } = options;

  console.log("[preprocess] detecting silences...");
  const [silences, totalDuration] = await Promise.all([
    detectSilences(videoPath, { silenceThresholdDb, minSilenceDuration }),
    getVideoDuration(videoPath),
  ]);

  console.log(`[preprocess] found ${silences.length} silences > ${minSilenceDuration}s in ${totalDuration.toFixed(1)}s video`);

  if (silences.length === 0) {
    // No long silences — skip trimming entirely, just use original
    console.log("[preprocess] no trimming needed");
    return {
      trimmed: false,
      originalDuration: totalDuration,
      trimmedDuration: totalDuration,
      silencesFound: 0,
      outputPath: videoPath, // use original
    };
  }

  const segments = buildKeepSegments(totalDuration, silences, keepDuration);
  const estimatedDuration = segments.reduce((sum, s) => sum + (s.end - s.start), 0);
  const removedDuration = totalDuration - estimatedDuration;

  console.log(`[preprocess] keeping ${segments.length} segments, removing ~${removedDuration.toFixed(1)}s of silence`);

  // Build and run the ffmpeg complex filter
  const complexFilter = buildComplexFilter(segments);

  await new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-y",
        "-i", videoPath,
        "-filter_complex", complexFilter,
        "-map", "[outv]",
        "-map", "[outa]",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        outputPath,
      ],
      { timeout: 15 * 60 * 1000 }, // 15 min for long videos
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg trim failed: ${stderr.slice(-500)}`));
        resolve();
      }
    );
  });

  console.log(`[preprocess] trimmed: ${totalDuration.toFixed(1)}s → ${estimatedDuration.toFixed(1)}s (removed ${removedDuration.toFixed(1)}s)`);

  return {
    trimmed: true,
    originalDuration: totalDuration,
    trimmedDuration: estimatedDuration,
    silencesFound: silences.length,
    outputPath,
  };
}

module.exports = { preprocessVideo, detectSilences, buildKeepSegments };
