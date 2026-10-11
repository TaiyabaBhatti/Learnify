// node scripts/test-cue-resolver.js   (Phase 3 checkpoint, no API needed)
import { resolveCue } from "../utils/cueResolver.js";
import { estimateWordTimings } from "../services/transcribe.service.js";

const narration = "A modern computer system consists of one or more CPUs and device controllers connected through a common bus that provides access to shared memory.";
const words = estimateWordTimings(narration, 12);
for (const cue of ["one or more CPUs", "common bus", "shared memory", "banana"]) {
  console.log(cue.padEnd(18), "->", resolveCue(cue, words, 0));
}
