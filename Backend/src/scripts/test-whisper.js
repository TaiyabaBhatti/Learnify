// node scripts/test-whisper.js path/to/scene-01.wav   (Phase 3 checkpoint)
import { whisperWords } from "../services/transcribe.service.js";
const words = await whisperWords(process.argv[2]);
console.table(words.slice(0, 25));
console.log("total words:", words.length);
