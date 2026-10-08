import { Router } from "express";
import { generateScript } from "../controllers/script.controller.js";
import { generateLesson } from "../controllers/pipeline.controller.js";

const router = Router();
router.post("/generate", generateLesson);
export default router;
