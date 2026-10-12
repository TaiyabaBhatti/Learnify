import { STAGES } from "../hooks/useLessonJob.js";

const ICON = {
  pending: "○",
  active: "◐",
  done: "✓",
  skipped: "↷",
  failed: "✕",
};
const COLOR = {
  pending: "#9aa0a6",
  active: "#1a73e8",
  done: "#188038",
  skipped: "#b06000",
  failed: "#d93025",
};

export default function ProgressPanel({
  stages,
  progress,
  message,
  phase,
  error,
  videoUrl,
}) {
  // Finished: hide the progress bar and the stage list, show only the video.
  if (phase === "done" && videoUrl) {
    return (
      <div
        style={{
          width: 640,
          margin: "24px auto",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ width: "100%", marginTop: 16, borderRadius: 8 }}>
          <video
            src={videoUrl}
            controls
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 640,
        margin: "24px auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <style>{`@keyframes lspin{to{transform:rotate(360deg)}}`}</style>

      <div
        style={{
          height: 10,
          background: "#e8eaed",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: phase === "failed" ? COLOR.failed : COLOR.active,
            transition: "width .4s",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "6px 0 16px",
          fontSize: 14,
        }}
      >
        <span>{message}</span>
        <strong>{progress}%</strong>
      </div>

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {STAGES.map(({ key, label }) => {
          const s = stages[key];
          return (
            <li
              key={key}
              style={{
                display: "flex",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid #f1f3f4",
                opacity: s.status === "pending" ? 0.55 : 1,
              }}
            >
              <span
                style={{
                  width: 22,
                  textAlign: "center",
                  fontSize: 18,
                  color: COLOR[s.status],
                  display: "inline-block",
                  animation:
                    s.status === "active" ? "lspin 1s linear infinite" : "none",
                }}
              >
                {ICON[s.status]}
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>{label}</div>
                {s.message && (
                  <div style={{ fontSize: 13, color: "#5f6368" }}>
                    {s.message}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {phase === "failed" && (
        <p style={{ color: COLOR.failed, marginTop: 16 }}>
          Something went wrong: {error}
        </p>
      )}

      {/* <div style={{ width: "100%", marginTop: 16, borderRadius: 8 }}>
        <video
          src={videoUrl}
          controls
          style={{ width: "100%", borderRadius: 8 }}
        />
      </div> */}

      {/* {log.length > 0 && (
        <details style={{ marginTop: 16, fontSize: 13 }}>
          <summary>Activity log</summary>
          <ul>
            {log.map((l, i) => (
              <li key={i}>
                {new Date(l.ts).toLocaleTimeString()}: {l.message}
              </li>
            ))}
          </ul>
        </details>
      )} */}
    </div>
  );
}
