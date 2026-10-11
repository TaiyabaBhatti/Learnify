// node scripts/test-director.js   (Phase 4 checkpoint)
import "dotenv/config";
import { directScene } from "../services/director.service.js";

const scene = {
  scene: 1,
  title: "Computer System Structure",
  visual_hint: "CPU, memory and devices connected by a bus",
  narration:
    "A modern computer system consists of one or more CPUs and device controllers connected through a common bus. The bus provides access to shared memory. Devices such as the keyboard, the mouse and the monitor each talk to the system through their controllers.",
};
console.log(JSON.stringify(await directScene(scene), null, 2));
