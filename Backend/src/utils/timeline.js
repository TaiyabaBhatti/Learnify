import path from "path";
import { resolveCue } from "./cueResolver.js";

const LEAD_SEC = 0.1; // show things a touch before the word is spoken

/**
 * Builds the props object Remotion renders. No AI here, just math.
 * scenes: pipeline scenes (with audioPath, durationSec)
 * storyboards[i]: validated storyboard for scene i
 * wordsByScene[i]: [{word,start,end}] for scene i
 */
export const buildLessonProps = ({
  scenes,
  storyboards,
  wordsByScene,
  baseUrl,
  jobId,
}) => {
  const outScenes = scenes.map((scene, i) => {
    const sb = storyboards[i];
    const words = wordsByScene[i];
    const n = sb.elements.length;
    let cursor = 0;

    const elements = sb.elements.map((el, k) => {
      const hit = resolveCue(el.cue, words, cursor);
      let startSec;
      if (hit) {
        cursor = hit.index;
        startSec = Math.max(0, hit.startSec - LEAD_SEC);
      } else {
        startSec = (k / n) * scene.durationSec * 0.8; // fallback: spread evenly
      }
      return { ...el, startSec };
    });

    // a line may never appear before the things it connects
    const startOf = Object.fromEntries(elements.map((e) => [e.id, e.startSec]));
    for (const e of elements) {
      if (e.type === "line")
        e.startSec = Math.max(
          e.startSec,
          startOf[e.from] ?? 0,
          startOf[e.to] ?? 0
        );
    }

    return {
      scene: scene.scene ?? i + 1,
      durationSec: scene.durationSec,
      audioUrl: `${baseUrl}/temp/${jobId}/audio/${path.basename(
        scene.audioPath
      )}`,
      layout: sb.layout,
      elements,
    };
  });
  return { scenes: outScenes };
};
