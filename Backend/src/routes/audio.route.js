import { Router } from "express";
import { generateAudio } from "../controllers/audio.controller.js";

const router = Router();
router.post("/audio-generate", generateAudio);

export default router;
