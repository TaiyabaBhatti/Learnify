import { interpolate } from "remotion";
import { THEME, fontFamily } from "../theme.js";
import { useReveal } from "./useReveal.js";

export const Box = ({ el, rect }) => {
  const p = useReveal(el.startSec, 0.45);
  const color = el.style === "accent" ? THEME.green : THEME.yellow;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x, top: rect.y, width: rect.w, height: rect.h,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        border: `4px solid ${color}`,
        borderRadius: 6,
        background: THEME.bg, // opaque so lines pass "behind" the box
        color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily, fontSize: 52, textAlign: "center", padding: 8, boxSizing: "border-box",
      }}
    >
      {el.label}
    </div>
  );
};
