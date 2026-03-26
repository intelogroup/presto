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
 *
 * Uses MP3 extraction (not WAV) — a 20-min mono audio is ~9MB as MP3 vs ~38MB
 * as WAV, comfortably under Whisper's 25MB upload limit without chunking.
 *
 * @param {string} videoPath - absolute path to video file
 * @param {string} jobId - used to name temp files
 * @returns {{ text: string, segments: Array<{start,end,text}> }}
 */
async function transcribe(videoPath, jobId) {
  const audioPath = `/tmp/${jobId}.mp3`;

  // Extract audio as MP3 (mono, 16kHz, 64kbps — ~9MB for 20 min)
  await new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      ["-y", "-i", videoPath, "-ar", "16000", "-ac", "1", "-b:a", "64k", "-f", "mp3", audioPath],
      { timeout: 5 * 60 * 1000 },
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg audio extraction failed: ${stderr}`));
        resolve();
      }
    );
  });

  // Verify file size — MP3 at 64kbps should never exceed 25MB even for 50+ min videos
  // but if it somehow does, log a warning (Whisper API will return a clear error)
  const audioStat = fs.statSync(audioPath);
  const audioSizeMB = audioStat.size / (1024 * 1024);
  console.log(`[transcribe] extracted audio: ${audioSizeMB.toFixed(1)} MB (MP3 64kbps mono 16kHz)`);
  if (audioSizeMB > 25) {
    throw new Error(`Extracted audio is ${audioSizeMB.toFixed(1)} MB — exceeds Whisper 25MB limit. Try a shorter video.`);
  }
  if (audioSizeMB > 24) {
    console.warn(`[transcribe] WARNING: audio file is ${audioSizeMB.toFixed(1)} MB — approaching Whisper 25MB limit`);
  }

  // Transcribe with Whisper
  const fileStream = fs.createReadStream(audioPath);
  let response;
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
    _wavPath: audioPath,
    _transcriptPath: transcriptPath,
  };
}

module.exports = { transcribe };
