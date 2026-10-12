import { useCallback, useEffect, useRef, useState } from "react";

const API = "http://localhost:5000";
const START_PATH = "/api/lesson/generate"; // the URL you POST to
const LESSON_BASE = "/api/lesson"; // events: `${LESSON_BASE}/:jobId/events`, snapshot: `${LESSON_BASE}/:jobId`

export const STAGES = [
  { key: "input", label: "Input received" },
  { key: "grounding", label: "Researching the topic" },
  { key: "script", label: "Writing the lesson script" },
  { key: "voice", label: "Recording the narration" },
  { key: "storyboard", label: "Designing the animation" },
  { key: "video", label: "Rendering the video" },
];
const KEYS = STAGES.map((s) => s.key);

const fresh = () => ({
  phase: "idle", // idle | running | done | failed
  jobId: null,
  progress: 0,
  message: "",
  stages: Object.fromEntries(
    STAGES.map((s) => [s.key, { status: "pending", message: "" }])
  ),
  log: [],
  videoUrl: null,
  error: null,
});

// Applies one live event from the stream.
const reduce = (prev, evt) => {
  const next = {
    ...prev,
    progress: evt.progress ?? prev.progress,
    message: evt.message ?? prev.message,
  };
  const entry = { ts: evt.ts, stage: evt.stage, message: evt.message };
  if (evt.type === "stage") {
    const status = evt.state === "start" ? "active" : evt.state; // active | done | skipped
    next.stages = {
      ...prev.stages,
      [evt.stage]: { status, message: evt.message },
    };
    next.log = [...prev.log, entry];
  } else if (evt.type === "detail") {
    next.stages = {
      ...prev.stages,
      [evt.stage]: { status: "active", message: evt.message },
    };
  } else if (evt.type === "complete") {
    next.phase = "done";
    next.videoUrl = evt.videoUrl;
    next.log = [...prev.log, entry];
  } else if (evt.type === "error") {
    next.phase = "failed";
    next.error = evt.message;
    next.stages = {
      ...prev.stages,
      [evt.stage]: { status: "failed", message: evt.message },
    };
    next.log = [...prev.log, entry];
  }
  return next;
};

// Applies one polled snapshot (fallback when the stream is unavailable).
const applySnapshot = (prev, snap) => {
  const cur = KEYS.indexOf(snap.stage);
  const stages = {};
  KEYS.forEach((k, i) => {
    if (i < cur)
      stages[k] = { status: "done", message: prev.stages[k].message };
    else if (i === cur) {
      const status =
        snap.status === "failed"
          ? "failed"
          : snap.status === "done"
          ? "done"
          : "active";
      stages[k] = { status, message: snap.message };
    } else stages[k] = { status: "pending", message: "" };
  });
  return {
    ...prev,
    stages,
    progress: snap.progress ?? prev.progress,
    message: snap.message || prev.message,
    phase:
      snap.status === "done"
        ? "done"
        : snap.status === "failed"
        ? "failed"
        : "running",
    videoUrl: snap.result?.videoUrl ?? prev.videoUrl,
    error: snap.error ?? null,
  };
};

export function useLessonJob() {
  const [state, setState] = useState(fresh());
  const esRef = useRef(null);
  const pollRef = useRef(null);

  const close = () => {
    esRef.current?.close();
    esRef.current = null;
    clearInterval(pollRef.current);
    pollRef.current = null;
  };
  useEffect(() => close, []);

  const poll = (jobId) => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}${LESSON_BASE}/${jobId}`);
        if (!res.ok) {
          close();
          setState((p) => ({
            ...p,
            phase: "failed",
            error:
              res.status === 404
                ? "The server no longer has this job (it may have restarted). Please try again."
                : "Could not read the job status.",
          }));
          return;
        }
        const snap = await res.json();
        setState((p) => applySnapshot(p, snap));
        if (snap.status !== "running") close();
      } catch {
        /* network blip: keep trying */
      }
    }, 1500);
  };

  const start = useCallback(async ({ topic, grade_level }) => {
    close();
    setState({
      ...fresh(),
      phase: "running",
      message: "Sending your request...",
    });
    try {
      const res = await fetch(`${API}${START_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade_level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setState((p) => ({ ...p, jobId: data.jobId }));

      const es = new EventSource(`${API}${LESSON_BASE}/${data.jobId}/events`);
      esRef.current = es;
      es.onmessage = (e) => {
        const evt = JSON.parse(e.data);
        setState((p) => reduce(p, evt));
        if (evt.type === "complete" || evt.type === "error") close();
      };
      es.onerror = () => {
        if (es.readyState !== EventSource.CLOSED) return; // browser is reconnecting by itself
        es.close();
        esRef.current = null;
        poll(data.jobId); // stream unavailable -> poll the snapshot instead
      };
    } catch (err) {
      setState((p) => ({ ...p, phase: "failed", error: err.message }));
    }
  }, []);

  const reset = useCallback(() => {
    close();
    setState(fresh());
  }, []);
  return { ...state, start, reset };
}
