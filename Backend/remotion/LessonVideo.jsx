import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { THEME } from "./theme.js";
import { sceneFrames } from "./config.js";
import { layoutScene } from "./layouts/index.js";
import { ChalkText } from "./components/ChalkText.jsx";
import { Box } from "./components/Box.jsx";
import { Icon } from "./components/Icon.jsx";
import { Line } from "./components/Line.jsx";

const SceneView = ({ scene }) => {
  const rects = layoutScene(scene.elements, scene.layout);
  const center = (id) => {
    const r = rects[id];
    return r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : null;
  };
  const src = scene.audioUrl.startsWith("http") ? scene.audioUrl : staticFile(scene.audioUrl);
  const lines = scene.elements.filter((e) => e.type === "line");
  const others = scene.elements.filter((e) => e.type !== "line");

  return (
    <AbsoluteFill>
      <Audio src={src} />
      {/* lines first so boxes (opaque) sit on top of them */}
      {lines.map((el) => {
        const a = center(el.from);
        const b = center(el.to);
        return a && b ? <Line key={el.id} el={el} a={a} b={b} /> : null;
      })}
      {others.map((el) => {
        const rect = rects[el.id];
        if (!rect) return null;
        if (el.type === "box") return <Box key={el.id} el={el} rect={rect} />;
        if (el.type === "icon") return <Icon key={el.id} el={el} rect={rect} />;
        return <ChalkText key={el.id} el={el} rect={rect} />; // title | text
      })}
    </AbsoluteFill>
  );
};

export const LessonVideo = ({ scenes }) => (
  <AbsoluteFill style={{ background: THEME.bg }}>
    <Series>
      {scenes.map((s) => (
        <Series.Sequence key={s.scene} durationInFrames={sceneFrames(s)}>
          <SceneView scene={s} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
