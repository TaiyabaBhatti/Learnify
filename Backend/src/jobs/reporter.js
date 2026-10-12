import { STAGES } from "./stages.js";
import { pushEvent } from "./job.store.js";

const idx = (key) => STAGES.findIndex((s) => s.key === key);
const before = (key) => STAGES.slice(0, idx(key)).reduce((a, s) => a + s.weight, 0);
const weightOf = (key) => STAGES[idx(key)]?.weight ?? 0;
const clamp01 = (n) => Math.min(1, Math.max(0, n));

/**
 * The pipeline talks to this object; it never knows about HTTP or SSE.
 * Event types: "stage" (start/done/skipped), "detail" (running), "complete", "error".
 */
export const createReporter = (job) => {
  const emit = (type, stage, state, message, progress, extra = {}) =>
    pushEvent(job, { type, stage, state, message, progress: Math.round(progress), ts: Date.now(), ...extra });
  const lastProgress = () => job.events.at(-1)?.progress ?? 0;

  return {
    stageStart: (stage, message) => emit("stage", stage, "start", message, before(stage)),
    detail: (stage, message, fraction = 0) =>
      emit("detail", stage, "running", message, before(stage) + weightOf(stage) * clamp01(fraction)),
    stageDone: (stage, message) => emit("stage", stage, "done", message, before(stage) + weightOf(stage)),
    stageSkipped: (stage, message) => emit("stage", stage, "skipped", message, before(stage) + weightOf(stage)),
    complete: (result) => {
      job.status = "done";
      job.result = result;
      emit("complete", "video", "done", "Your lesson video is ready", 100, { jobId: job.id, videoUrl: result.videoUrl });
    },
    fail: (stage, message) => {
      job.status = "failed";
      job.error = message;
      emit("error", stage, "failed", message, lastProgress());
    },
  };
};

// Used when the pipeline is run without a job (scripts, tests).
export const noopReporter = new Proxy({}, { get: () => () => {} });
