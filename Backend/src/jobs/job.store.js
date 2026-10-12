import crypto from "crypto";
import { EventEmitter } from "events";

// In-memory job registry. Good for an FYP demo on one server.
// (Upgrade path: BullMQ + Redis keeps jobs across restarts and multiple servers.)
const jobs = new Map();
const TTL_MS = 60 * 60 * 1000; // forget finished jobs after 1 hour

export const createJob = (input) => {
  const job = {
    id: crypto.randomUUID(),
    status: "running", // running | done | failed
    input,
    events: [], // full history, replayed to late or reconnecting clients
    result: null,
    error: null,
    createdAt: Date.now(),
    emitter: new EventEmitter(),
  };
  job.emitter.setMaxListeners(20);
  jobs.set(job.id, job);
  return job;
};

export const getJob = (id) => jobs.get(id);

export const pushEvent = (job, evt) => {
  const full = { id: job.events.length, ...evt };
  job.events.push(full);
  console.log(
    `[job ${job.id.slice(0, 8)}] ${full.progress}% ${full.stage} ${
      full.state
    }: ${full.message}`
  );
  job.emitter.emit("event", full);
  return full;
};

setInterval(() => {
  const now = Date.now();
  for (const [id, j] of jobs)
    if (j.status !== "running" && now - j.createdAt > TTL_MS) jobs.delete(id);
}, 10 * 60 * 1000).unref();
