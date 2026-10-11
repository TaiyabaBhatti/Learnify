import { THEME } from "../theme.js";
import { WIDTH, HEIGHT } from "../config.js";
import { useReveal } from "./useReveal.js";

// Draws itself from a -> b. (Arrowheads: easy extension, see README.)
export const Line = ({ el, a, b }) => {
  const p = useReveal(el.startSec, 0.8);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={WIDTH} height={HEIGHT}>
      <line
        x1={a.x} y1={a.y}
        x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p}
        stroke={THEME.yellow} strokeWidth={5} strokeLinecap="round"
      />
    </svg>
  );
};
