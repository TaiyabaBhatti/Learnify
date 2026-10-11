import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// 0 -> 1 progress starting at startSec (scene-relative), lasting durSec.
export const useReveal = (startSec, durSec = 0.5) => {
  const frame = useCurrentFrame(); // relative to the scene's Series.Sequence
  const { fps } = useVideoConfig();
  return interpolate(frame, [startSec * fps, (startSec + durSec) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
