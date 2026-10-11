import { icons } from "lucide-react";
import { interpolate } from "remotion";
import { THEME, fontFamily } from "../theme.js";
import { useReveal } from "./useReveal.js";

const toPascal = (n = "") => n.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");

export const Icon = ({ el, rect }) => {
  const p = useReveal(el.startSec, 0.45);
  const Cmp = icons[toPascal(el.name)] ?? icons.Circle;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x, top: rect.y, width: rect.w, height: rect.h,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
        background: THEME.bg,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}
    >
      <Cmp size={130} color={THEME.yellow} strokeWidth={1.8} />
      {el.label ? (
        <div style={{ fontFamily, fontSize: 44, color: THEME.blue, marginTop: 6 }}>{el.label}</div>
      ) : null}
    </div>
  );
};
