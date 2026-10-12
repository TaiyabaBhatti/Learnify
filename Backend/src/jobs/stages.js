// The stages the user sees, in order. "weight" decides how much of the overall
// 0-100% bar each stage owns (video rendering is the slowest, so it owns the most).
export const STAGES = [
  { key: "input", label: "Input received", weight: 2 },
  { key: "grounding", label: "Researching the topic", weight: 8 },
  { key: "script", label: "Writing the lesson script", weight: 15 },
  { key: "voice", label: "Recording the narration", weight: 15 },
  { key: "storyboard", label: "Designing the animation", weight: 20 },
  { key: "video", label: "Rendering the video", weight: 40 },
];
