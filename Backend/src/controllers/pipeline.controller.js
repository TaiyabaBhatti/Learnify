import { runLessonPipeline } from "../services/pipeline.service.js";
import { createJob, getJob } from "../jobs/job.store.js";
import { createReporter } from "../jobs/reporter.js";
import runDemo from "../jobs/demoRun.js";

export const generateLesson = async (req, res, next) => {
  //  va;idaying input - later it will done with zod
  const { topic, grade_level } = req.body;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "Topic is required" });
  }

  const input = { topic: topic.trim(), grade_level };
  const job = createJob(input);
  const reporter = createReporter(job);

  // Deliberately NOT awaited: the client follows progress through the events endpoint.
  // runLessonPipeline(input, { jobId: job.id, reporter }).catch((err) =>
  //   console.error(`[job ${job.id}] failed:`, err.message)
  // );
  if (process.env.DEMO_MODE === "true") {
    const base = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
    console.log(`[job ${job.id}] DEMO_MODE: simulated pipeline`);
    runDemo(reporter, {
      videoUrl: `${base}/outputs/${process.env.DEMO_VIDEO}`,
      topic: input.topic,
    }).catch((e) => console.error("demo failed:", e.message));
  } else {
    // Deliberately NOT awaited: the client follows progress through the events endpoint.
    runLessonPipeline(input, { jobId: job.id, reporter }).catch((err) =>
      console.error(`[job ${job.id}] failed:`, err.message)
    );
  }
  res.status(202).json({ jobId: job.id });
};

// GET /:jobId  -> one-time JSON snapshot (also the polling fallback)
export const getJobStatus = (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });
  const last = job.events.at(-1);
  res.json({
    jobId: job.id,
    status: job.status,
    stage: last?.stage ?? null,
    message: last?.message ?? "",
    progress: last?.progress ?? 0,
    error: job.error,
    result: job.result,
  });
};

// GET /:jobId/events  -> live Server-Sent Events stream
export const streamJobEvents = (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });

  console.log(
    `[sse] browser connected to job ${job.id.slice(0, 8)}, replaying ${
      job.events.length
    } events`
  );

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write("retry: 3000\n\n");

  const send = (evt) =>
    res.write(`id: ${evt.id}\ndata: ${JSON.stringify(evt)}\n\n`);

  // replay history first, so late or reconnecting clients see every stage
  const lastSeen = Number(req.headers["last-event-id"]);
  const from = Number.isInteger(lastSeen) ? lastSeen + 1 : 0;
  job.events.slice(from).forEach(send);

  if (job.status !== "running") return res.end();

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);
  const onEvent = (evt) => {
    send(evt);
    if (evt.type === "complete" || evt.type === "error") {
      cleanup();
      res.end();
    }
  };
  const cleanup = () => {
    clearInterval(heartbeat);
    job.emitter.off("event", onEvent);
  };
  job.emitter.on("event", onEvent);

  res.on("close", () => {
    console.log(`[sse] browser disconnected from job ${job.id.slice(0, 8)}`);
    cleanup();
  });
};
