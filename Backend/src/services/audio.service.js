import fs from "fs/promises";
import path from "path";
import { generateSpeech } from "./gemini.tts.service.js";
import { ensureWav, getWavDuration } from "../utils/audio.js";

export async function generateSceneAudio(scenes, outDir, onProgress) {
  let done = 0;
  await fs.mkdir(outDir, { recursive: true });

  const results = [];
  for (const [i, scene] of scenes.entries()) {
    const text = scene.narration?.trim();
    if (!text) throw new Error(`Scene ${i + 1} has no narration`);

    const { data, mimeType } = await generateSpeech(text);
    const wav = ensureWav(data, mimeType);

    const durationSec = Number(getWavDuration(wav).toFixed(3));

    const audioPath = path.join(
      outDir,
      `scene-${String(i + 1).padStart(2, "0")}.wav`
    );
    await fs.writeFile(audioPath, wav);

    results.push({ scene: i + 1, audioPath, durationSec });
    onProgress?.(++done, scenes.length);
  }
  return results; // sequential on purpose: respects free-tier rate limits
}
