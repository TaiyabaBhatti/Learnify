import { THEME, fontFamily } from "../theme.js";
import { useReveal } from "./useReveal.js";

// Used for both "title" and "text": characters appear left to right like writing.
export const ChalkText = ({ el, rect }) => {
  const isTitle = el.type === "title";
  const text = el.text ?? el.label ?? "";
  const dur = Math.min(4, Math.max(0.6, text.length / 24));
  const p = useReveal(el.startSec, dur);
  const underline = useReveal(el.startSec + dur, 0.4);
  const n = Math.ceil(p * text.length);

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x, top: rect.y, width: rect.w, height: rect.h,
        fontFamily,
        fontSize: isTitle ? 88 : 52,
        lineHeight: 1.15,
        color: isTitle ? THEME.yellow : THEME.chalk,
        textAlign: isTitle ? "center" : "left",
      }}
    >
      <span>{text.slice(0, n)}</span>
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
      {isTitle && (
        <div style={{ height: 5, background: THEME.yellow, width: `${underline * 100}%`, margin: "6px auto 0" }} />
      )}
    </div>
  );
};
