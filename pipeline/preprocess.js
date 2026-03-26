/**
 * preprocess.js — Validate, trim silences, and compress uploaded media.
 *
 * Pipeline step 1 (before transcription):
 *   1. Probe & validate the input file (reject no-audio, reject < 30s)
 *   2. Detect long silences (>4s) and trim them down to ~2s
 *   3. Compress video if file is too large or bitrate too high
 *
 * Accepts both video files and audio-only files (e.g. for pairing with PPTX).
 */

const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Run ffprobe and return parsed JSON output.
 * @param {string} filePath
 * @param {string[]} extraArgs - additional ffprobe arguments
 * @returns {Promise<object>}
 */
function ffprobeJson(filePath, extraArgs = []) {
  return new Promise((resolve, reject) => {
    execFile(
      "ffprobe",
      [
        "-v", "error",
        "-print_format", "json",
        ...extraArgs,
        filePath,
      ],
      { timeout: 30 * 1000 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(`ffprobe failed: ${stderr}`));
        try {
          resolve(JSON.parse(stdout));
        } catch (parseErr) {
          reject(new Error(`ffprobe JSON parse error: ${parseErr.message}`));
        }
      }
    );
  });
}

/**
 * Get file size in megabytes.
 */
function fileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

// ---------------------------------------------------------------------------
// 1. Probe & Validate
// ---------------------------------------------------------------------------

/**
 * Probe the input file and validate it meets requirements.
 *
 * - REJECT if video has NO audio track (throw)
 * - ACCEPT audio-only files (no video stream is OK)
 * - REJECT if duration < 30 seconds (throw)
 *
 * @param {string} filePath - absolute path to media file
 * @returns {Promise<{ hasVideo: boolean, hasAudio: boolean, duration: number, videoCodec: string|null, audioCodec: string|null, fileSizeMB: number }>}
 */
async function validateInput(filePath) {
  const probe = await ffprobeJson(filePath, [
    "-show_streams",
    "-show_format",
  ]);

  const streams = probe.streams || [];
  const format = probe.format || {};

  const videoStream = streams.find((s) => s.codec_type === "video");
  const audioStream = streams.find((s) => s.codec_type === "audio");

  const hasVideo = !!videoStream;
  const hasAudio = !!audioStream;
  const duration = parseFloat(format.duration) || 0;
  const videoCodec = videoStream ? videoStream.codec_name : null;
  const audioCodec = audioStream ? audioStream.codec_name : null;
  const sizeMB = fileSizeMB(filePath);

  // Reject: video with no audio
  if (hasVideo && !hasAudio) {
    throw new Error("Video has no audio track");
  }

  // Reject: too short
  if (duration < 30) {
    throw new Error("File must be at least 30 seconds");
  }

  return { hasVideo, hasAudio, duration, videoCodec, audioCodec, fileSizeMB: sizeMB };
}

// ---------------------------------------------------------------------------
// 2. Silence detection & trimming
// ---------------------------------------------------------------------------

/**
 * Detect silent segments in a media file using ffmpeg silencedetect.
 *
 * @param {string} filePath
 * @param {object} [options]
 * @param {number} [options.silenceThresholdDb=-30] - dB threshold below which audio is "silent"
 * @param {number} [options.minSilenceDuration=4] - minimum silence duration in seconds to detect
 * @returns {Promise<Array<{ start: number, end: number }>>} silent segments
 */
async function detectSilences(filePath, options = {}) {
  const { silenceThresholdDb = -30, minSilenceDuration = 4 } = options;

  return new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-i", filePath,
        "-af", `silencedetect=noise=${silenceThresholdDb}dB:d=${minSilenceDuration}`,
        "-f", "null", "-",
      ],
      { timeout: 5 * 60 * 1000 },
      (err, _stdout, stderr) => {
        // ffmpeg writes silencedetect output to stderr (this is normal)
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
            end: i < ends.length ? ends[i] : Infinity, // silence extends to end of file
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
 * Build the list of segments to KEEP, given silent segments to trim.
 * Each silence >minDuration is trimmed down to `keepDuration` seconds.
 *
 * @param {number} totalDuration - file duration in seconds
 * @param {Array<{ start: number, end: number }>} silences - detected silent segments
 * @param {number} [keepDuration=2.0] - how much silence to preserve (seconds)
 * @returns {Array<{ start: number, end: number }>} segments to keep
 */
function buildKeepSegments(totalDuration, silences, keepDuration = 2.0) {
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
 * Generate an ffmpeg complex filter string from keep segments.
 * Handles both audio+video and audio-only files.
 *
 * @param {Array<{ start: number, end: number }>} segments
 * @param {boolean} hasVideo - whether the input file has a video stream
 * @returns {string} ffmpeg -filter_complex value
 */
function buildComplexFilter(segments, hasVideo = true) {
  const filters = [];
  const concatInputs = [];

  if (hasVideo) {
    segments.forEach((seg, i) => {
      const start = seg.start.toFixed(4);
      const duration = (seg.end - seg.start).toFixed(4);
      filters.push(`[0:v]trim=start=${start}:duration=${duration},setpts=PTS-STARTPTS[v${i}]`);
      filters.push(`[0:a]atrim=start=${start}:duration=${duration},asetpts=PTS-STARTPTS[a${i}]`);
      concatInputs.push(`[v${i}][a${i}]`);
    });

    const concatFilter = `${concatInputs.join("")}concat=n=${segments.length}:v=1:a=1[outv][outa]`;
    filters.push(concatFilter);
  } else {
    // Audio-only: no video streams in filter
    segments.forEach((seg, i) => {
      const start = seg.start.toFixed(4);
      const duration = (seg.end - seg.start).toFixed(4);
      filters.push(`[0:a]atrim=start=${start}:duration=${duration},asetpts=PTS-STARTPTS[a${i}]`);
      concatInputs.push(`[a${i}]`);
    });

    const concatFilter = `${concatInputs.join("")}concat=n=${segments.length}:v=0:a=1[outa]`;
    filters.push(concatFilter);
  }

  return filters.join(";");
}

/**
 * Run ffmpeg to trim the file using a complex filter.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {string} complexFilter
 * @param {boolean} hasVideo
 * @returns {Promise<void>}
 */
function runTrimFilter(inputPath, outputPath, complexFilter, hasVideo) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i", inputPath,
      "-filter_complex", complexFilter,
    ];

    if (hasVideo) {
      args.push("-map", "[outv]", "-map", "[outa]");
      args.push("-c:v", "libx264", "-preset", "fast", "-crf", "23");
    } else {
      args.push("-map", "[outa]");
    }

    args.push("-c:a", "aac", "-b:a", "128k");

    if (hasVideo) {
      args.push("-movflags", "+faststart");
    }

    args.push(outputPath);

    execFile(
      "ffmpeg",
      args,
      { timeout: 15 * 60 * 1000 }, // 15 min for long files
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg trim failed: ${(stderr || "").slice(-500)}`));
        resolve();
      }
    );
  });
}

// ---------------------------------------------------------------------------
// 3. Compress large video
// ---------------------------------------------------------------------------

/**
 * Re-encode the video if it is too large (>200 MB) or the video bitrate is
 * too high (>5 Mbps). Audio-only files are skipped.
 *
 * @param {string} inputPath
 * @param {string} outputPath - where to write the compressed file
 * @param {object} info - result from validateInput
 * @param {boolean} info.hasVideo
 * @returns {Promise<{ compressed: boolean, outputPath: string }>}
 */
async function compressIfNeeded(inputPath, outputPath, info) {
  // Skip compression for audio-only files
  if (!info.hasVideo) {
    return { compressed: false, outputPath: inputPath };
  }

  const sizeMB = fileSizeMB(inputPath);

  // Check video bitrate via ffprobe
  let videoBitrate = 0;
  try {
    const probe = await ffprobeJson(inputPath, ["-show_streams"]);
    const videoStream = (probe.streams || []).find((s) => s.codec_type === "video");
    if (videoStream && videoStream.bit_rate) {
      videoBitrate = parseInt(videoStream.bit_rate, 10);
    }
  } catch (_) {
    // If probe fails, fall back to size-based check only
  }

  const fiveMbps = 5 * 1000 * 1000; // 5,000,000 bps

  if (sizeMB <= 200 && videoBitrate <= fiveMbps) {
    return { compressed: false, outputPath: inputPath };
  }

  console.log(
    `[preprocess] compressing video (${sizeMB.toFixed(1)} MB, ` +
    `bitrate ${(videoBitrate / 1e6).toFixed(1)} Mbps) → ~3 Mbps h264`
  );

  await new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-y",
        "-i", inputPath,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "28",
        "-b:v", "3M",
        "-maxrate", "3M",
        "-bufsize", "6M",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        outputPath,
      ],
      { timeout: 15 * 60 * 1000 },
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg compress failed: ${(stderr || "").slice(-500)}`));
        resolve();
      }
    );
  });

  console.log(`[preprocess] compressed: ${sizeMB.toFixed(1)} MB → ${fileSizeMB(outputPath).toFixed(1)} MB`);

  return { compressed: true, outputPath };
}

// ---------------------------------------------------------------------------
// 4. Main entry point
// ---------------------------------------------------------------------------

/**
 * Preprocess a media file: validate → trim silences → compress.
 *
 * @param {string} inputPath - absolute path to input media file
 * @param {string} outputDir - directory for intermediate and final output files
 * @param {object} [options]
 * @param {number} [options.silenceThresholdDb=-30]
 * @param {number} [options.minSilenceDuration=4]
 * @param {number} [options.keepDuration=2.0]
 * @returns {Promise<{ trimmed: boolean, compressed: boolean, hasVideo: boolean, hasAudio: boolean, originalDuration: number, trimmedDuration: number, silencesFound: number, outputPath: string, fileSizeMB: number }>}
 */
async function preprocessVideo(inputPath, outputDir, options = {}) {
  const {
    silenceThresholdDb = -30,
    minSilenceDuration = 4,
    keepDuration = 2.0,
  } = options;

  // ------ Step 1: Validate ------
  console.log("[preprocess] validating input...");
  const info = await validateInput(inputPath);
  console.log(
    `[preprocess] validated: hasVideo=${info.hasVideo} hasAudio=${info.hasAudio} ` +
    `duration=${info.duration.toFixed(1)}s codec=${info.videoCodec || "none"}/${info.audioCodec} ` +
    `size=${info.fileSizeMB.toFixed(1)}MB`
  );

  // ------ Step 2: Detect silences & trim ------
  console.log("[preprocess] detecting silences...");
  const silences = await detectSilences(inputPath, { silenceThresholdDb, minSilenceDuration });
  console.log(`[preprocess] found ${silences.length} silences > ${minSilenceDuration}s in ${info.duration.toFixed(1)}s file`);

  const ext = path.extname(inputPath) || (info.hasVideo ? ".mp4" : ".m4a");
  const baseName = path.basename(inputPath, path.extname(inputPath));

  let currentPath = inputPath;
  let trimmed = false;
  let trimmedDuration = info.duration;

  if (silences.length > 0) {
    const segments = buildKeepSegments(info.duration, silences, keepDuration);
    const estimatedDuration = segments.reduce((sum, s) => sum + (s.end - s.start), 0);
    const removedDuration = info.duration - estimatedDuration;

    console.log(`[preprocess] keeping ${segments.length} segments, removing ~${removedDuration.toFixed(1)}s of silence`);

    const trimOutputPath = path.join(outputDir, `${baseName}_trimmed${ext}`);
    const complexFilter = buildComplexFilter(segments, info.hasVideo);
    await runTrimFilter(inputPath, trimOutputPath, complexFilter, info.hasVideo);

    console.log(`[preprocess] trimmed: ${info.duration.toFixed(1)}s → ${estimatedDuration.toFixed(1)}s (removed ${removedDuration.toFixed(1)}s)`);

    currentPath = trimOutputPath;
    trimmed = true;
    trimmedDuration = estimatedDuration;
  } else {
    console.log("[preprocess] no trimming needed");
  }

  // ------ Step 3: Compress if needed ------
  const compressOutputPath = path.join(outputDir, `${baseName}_compressed${ext}`);
  const compressResult = await compressIfNeeded(currentPath, compressOutputPath, info);

  if (compressResult.compressed) {
    currentPath = compressResult.outputPath;
  }

  const finalSizeMB = fileSizeMB(currentPath);

  console.log(`[preprocess] done → ${currentPath} (${finalSizeMB.toFixed(1)} MB)`);

  return {
    trimmed,
    compressed: compressResult.compressed,
    hasVideo: info.hasVideo,
    hasAudio: info.hasAudio,
    originalDuration: info.duration,
    trimmedDuration,
    silencesFound: silences.length,
    outputPath: currentPath,
    fileSizeMB: finalSizeMB,
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  preprocessVideo,
  validateInput,
  detectSilences,
  buildKeepSegments,
  compressIfNeeded,
};
