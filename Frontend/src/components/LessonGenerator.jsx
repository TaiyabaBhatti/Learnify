import { useState } from "react";
import { useLessonJob } from "../hooks/useLessonJob.js";
import ProgressPanel from "./ProgressPanel.jsx";

const GRADES = ["Class 2-3", "Class 4-5", "Class 6-7"]; // match your backend enum

export default function LessonGenerator() {
  const job = useLessonJob();
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState(GRADES[0]);
  const busy = job.phase === "running";

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, maxWidth: 640, margin: "0 auto" }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn?"
          style={{ flex: 1, padding: 10 }}
          disabled={busy}
        />
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          disabled={busy}
        >
          {GRADES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button
          disabled={busy || !topic.trim()}
          onClick={() => job.start({ topic, grade_level: grade })}
        >
          {busy ? "Generating..." : "Generate lesson"}
        </button>
      </div>

      {job.phase !== "idle" && <ProgressPanel {...job} />}
    </div>
  );
}
