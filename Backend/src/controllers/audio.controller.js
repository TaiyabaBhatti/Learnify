import fs from "fs/promises";
import path from "path";
import { generateSpeech } from "../services/gemini.tts.service.js";
import {
  getPcmDuration,
  pcmToWav,
  ensureWav,
  getWavDuration,
} from "../utils/audio.js";

export async function generateAudio(req, res) {
  try {
    const { scenes } = req.body;
    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({ error: "scenes array required" });
    }

    const dir = path.join(process.cwd(), "temp", "audio");
    await fs.mkdir(dir, { recursive: true });

    const results = [];
    for (const [i, scene] of scenes.entries()) {
      const audio = ensureWav(await generateSpeech(scene.narration));
      const durationSec = getWavDuration(audio);
      await fs.writeFile(audioPath, audio);
      await fs.writeFile(audioPath, pcmToWav(pcm));
      results.push({ scene: i + 1, audioPath, durationSec });
    }

    res.json({ audio: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
