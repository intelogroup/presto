const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg failed: ${stderr}`));
        resolve();
      }
    );
  });

  // Transcribe with Whisper
  const fileStream = fs.createReadStream(wavPath);
  const response = await getOpenAI().audio.transcriptions.create({
    model: "whisper-1",
    file: fileStream,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

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
