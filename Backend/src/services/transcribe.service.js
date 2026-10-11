import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import ffmpegPath from "ffmpeg-static";
import { getNarration } from "../utils/scene.js";

const run = promisify(execFile);
const WHISPER_DIR = path.join(process.cwd(), "whisper.cpp");
const WHISPER_VERSION = "1.5.5";
const MODEL = "base.en"; // use "tiny.en" if your laptop is slow

let readyPromise;
const ensureWhisper = async () => {
  if (!readyPromise) {
    readyPromise = (async () => {
      // dynamic import so the server still starts if the package is missing
      const { installWhisperCpp, downloadWhisperModel } = await import(
        "@remotion/install-whisper-cpp"
      );
      await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION });
      await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR });
    })().catch((e) => {
      readyPromise = undefined;
      throw e;
    });
  }
  return readyPromise;
};

// Merge sub-word tokens into words. A new word starts when the token begins with a space.
const tokensToWords = (captions) => {
  const words = [];
  for (const c of captions) {
    const raw = c.text ?? "";
    const t = raw.trim();
    if (!t || /^\[.*\]$/.test(t)) continue;
    const startsNew = /^\s/.test(raw) || words.length === 0;
    if (startsNew)
      words.push({ word: t, start: c.startMs / 1000, end: c.endMs / 1000 });
    else {
      const last = words[words.length - 1];
      last.word += t;
      last.end = c.endMs / 1000;
    }
  }
  return words;
};

export const whisperWords = async (audioPath) => {
  await ensureWhisper();
  const { transcribe, toCaptions } = await import(
    "@remotion/install-whisper-cpp"
  );
  const wav16 = audioPath.replace(/\.wav$/i, ".16k.wav");
  await run(ffmpegPath, [
    "-y",
    "-i",
    audioPath,
    "-ar",
    "16000",
    "-ac",
    "1",
    wav16,
  ]);
  const out = await transcribe({
    model: MODEL,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: WHISPER_VERSION,
    inputPath: wav16,
    tokenLevelTimestamps: true,
  });
  const { captions } = toCaptions({ whisperCppOutput: out });
  return tokensToWords(captions);
};

// Fallback / phase-1 mode: spread the known narration words over the audio duration.
export const estimateWordTimings = (narration, durationSec) => {
  const ws = narration.split(/\s+/).filter(Boolean);
  const weights = ws.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const usable = Math.max(0.1, durationSec - 0.3);
  let acc = 0;
  return ws.map((word, i) => {
    const start = (acc / total) * usable;
    acc += weights[i];
    return { word, start, end: (acc / total) * usable };
  });
};

export const getWordTimings = async (scene) => {
  if (process.env.USE_WHISPER === "true") {
    try {
      const words = await whisperWords(scene.audioPath);
      if (words.length) return words;
    } catch (e) {
      console.warn("[whisper] failed, using estimated timings:", e.message);
    }
  }
  return estimateWordTimings(getNarration(scene), scene.durationSec);
};
