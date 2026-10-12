import { Router } from "express";

import {
  generateLesson,
  getJobStatus,
  streamJobEvents,
} from "../controllers/pipeline.controller.js";
getJobStatus;

const router = Router();
router.post("/generate", generateLesson);

router.get("/:jobId/events", streamJobEvents);
router.get("/:jobId", getJobStatus);
export default router;
