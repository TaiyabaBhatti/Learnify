import "dotenv/config"; // must stay the first import
import fs from "fs/promises";
import path from "path";
import { generateSpeech } from "../services/gemini.tts.service.js";
import { ensureWav, getWavDuration } from "../utlis/audio.js";

const text =
  "What Happens When We Eat? Narration We eat yummy food like apples and sandwiches every day. But where does all that food go after we swallow it? Our body has a special system to break down food. This amazing process is called digestion. Key Concept Digestion is the process where our body breaks down food into tiny pieces to get energy and nutrients. Whiteboard Visual A drawing of a happy child eating an apple, with an arrow pointing from the apple towards a simple outline of the child's body, labeled 'Digestion begins!'";

const raw = await generateSpeech(text);
console.log("Bytes returned:", raw.length);
console.log("Starts with:", raw.toString("ascii", 0, 4)); // "RIFF" means it is already a WAV

const audio = ensureWav(raw);
console.log("Duration (min):", getWavDuration(audio).toFixed(2));

const dir = path.join(process.cwd(), "temp", "audio");
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(path.join(dir, "test.wav"), audio);
console.log("Saved temp/audio/test.wav");
