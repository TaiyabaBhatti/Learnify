import { Composition } from "remotion";
import { LessonVideo } from "./LessonVideo.jsx";
import { FPS, WIDTH, HEIGHT, sceneFrames } from "./config.js";
import sample from "./dev/sample-props.json";

export const RemotionRoot = () => (
  <Composition
    id="Lesson"
    component={LessonVideo}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={FPS * 10}
    defaultProps={sample}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(1, props.scenes.reduce((sum, s) => sum + sceneFrames(s), 0)),
    })}
  />
);
