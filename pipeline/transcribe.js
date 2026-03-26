const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 3 });
  return _openai;
}

/**
 * Extracts audio from video and transcribes with Whisper.
 * @param {string} videoPath - absolute path to video file
 * @param {string} jobId - used to name temp files
 * @returns {{ text: string, segments: Array<{start,end,text}>, words: Array<{word,start,end}> }}
 */
async function transcribe(videoPath, jobId) {
  const wavPath = `/tmp/${jobId}.wav`;

  // Extract audio as WAV
  await new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      ["-y", "-i", videoPath, "-ar", "16000", "-ac", "1", "-f", "wav", wavPath],
      { timeout: 5 * 60 * 1000 },
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg failed: ${stderr}`));
        resolve();
      }
    );
  });

  // Check file size against Whisper 25MB limit (use 24MB with 1MB margin)
  const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24MB
  const wavStat = fs.statSync(wavPath);
  let response;

  if (wavStat.size <= MAX_FILE_SIZE) {
    // Single-file transcription path
    const fileStream = fs.createReadStream(wavPath);
    try {
      response = await getOpenAI().audio.transcriptions.create({
        model: "whisper-1",
        file: fileStream,
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
      });
    } finally {
      fileStream.destroy();
    }
  } else {
    // File exceeds 24MB — split into chunks and transcribe each
    const fileSizeMB = wavStat.size / (1024 * 1024);

    // Get duration via ffprobe
    const duration = await new Promise((resolve, reject) => {
      execFile(
        "ffprobe",
        ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wavPath],
        (err, stdout, stderr) => {
          if (err) return reject(new Error(`ffprobe failed: ${stderr}`));
          const dur = parseFloat(stdout.trim());
          if (isNaN(dur)) return reject(new Error("ffprobe returned invalid duration"));
          resolve(dur);
        }
      );
    });

    // Calculate segment_time so each chunk is ~20MB
    const segmentTime = Math.floor(duration * (20 / fileSizeMB));
    const chunkPattern = `/tmp/${jobId}_chunk_%03d.wav`;

    // Split with ffmpeg
    await new Promise((resolve, reject) => {
      execFile(
        "ffmpeg",
        ["-y", "-i", wavPath, "-f", "segment", "-segment_time", String(segmentTime), "-c", "copy", chunkPattern],
        { timeout: 5 * 60 * 1000 },
        (err, _stdout, stderr) => {
          if (err) return reject(new Error(`ffmpeg split failed: ${stderr}`));
          resolve();
        }
      );
    });

    // Discover chunk files
    const chunkFiles = [];
    for (let i = 0; ; i++) {
      const chunkPath = `/tmp/${jobId}_chunk_${String(i).padStart(3, "0")}.wav`;
      if (!fs.existsSync(chunkPath)) break;
      chunkFiles.push(chunkPath);
    }

    if (chunkFiles.length === 0) {
      throw new Error("ffmpeg split produced no chunk files");
    }

    // Transcribe each chunk and merge results
    let mergedText = "";
    const mergedSegments = [];
    const mergedWords = [];
    let cumulativeDuration = 0;

    try {
      for (const chunkPath of chunkFiles) {
        // Get this chunk's duration via ffprobe
        const chunkDuration = await new Promise((resolve, reject) => {
          execFile(
            "ffprobe",
            ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", chunkPath],
            (err, stdout, stderr) => {
              if (err) return reject(new Error(`ffprobe chunk failed: ${stderr}`));
              const dur = parseFloat(stdout.trim());
              if (isNaN(dur)) return reject(new Error("ffprobe returned invalid chunk duration"));
              resolve(dur);
            }
          );
        });

        const fileStream = fs.createReadStream(chunkPath);
        let chunkResponse;
        try {
          chunkResponse = await getOpenAI().audio.transcriptions.create({
            model: "whisper-1",
            file: fileStream,
            response_format: "verbose_json",
            timestamp_granularities: ["segment"],
          });
        } finally {
          fileStream.destroy();
        }

        // Merge text
        if (chunkResponse.text) {
          mergedText += (mergedText.length > 0 ? " " : "") + chunkResponse.text;
        }

        // Merge segments with timestamp offset
        if (chunkResponse.segments) {
          for (const s of chunkResponse.segments) {
            mergedSegments.push({
              ...s,
              start: s.start + cumulativeDuration,
              end: s.end + cumulativeDuration,
            });
          }
        }

        // Merge words with timestamp offset
        if (chunkResponse.words) {
          for (const w of chunkResponse.words) {
            mergedWords.push({
              ...w,
              start: w.start + cumulativeDuration,
              end: w.end + cumulativeDuration,
            });
          }
        }

        cumulativeDuration += chunkDuration;
      }
    } finally {
      // Clean up chunk files
      for (const chunkPath of chunkFiles) {
        try { fs.unlinkSync(chunkPath); } catch (_) { /* ignore */ }
      }
    }

    response = {
      text: mergedText,
      segments: mergedSegments,
      words: mergedWords,
    };
  }

  if (!response.text || response.text.trim().length === 0) {
    throw new Error("Whisper returned an empty transcript");
  }

  // Save transcript JSON — durable copy in output/transcripts/ for rerenders,
  // plus a /tmp copy for backwards-compat with cleanup logic.
  const safeJobId = String(jobId).replace(/[^a-zA-Z0-9\-_]/g, "_");
  const transcriptsDir = path.join(__dirname, "..", "output", "transcripts");
  fs.mkdirSync(transcriptsDir, { recursive: true });
  const durableTranscriptPath = path.join(transcriptsDir, `${safeJobId}.json`);
  fs.writeFileSync(durableTranscriptPath, JSON.stringify(response, null, 2));
  const transcriptPath = `/tmp/${safeJobId}.transcript.json`;
  fs.writeFileSync(transcriptPath, JSON.stringify(response, null, 2));
  console.log(`[transcribe] transcript saved → ${durableTranscriptPath}`);

  return {
    text: response.text,
    segments: (response.segments || []).map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text,
    })),
    words: (response.words || []).map((w) => ({
      word: w.word,
      start: w.start,
      end: w.end,
    })),
    _wavPath: wavPath,
    _transcriptPath: transcriptPath,
  };
}

module.exports = { transcribe };
