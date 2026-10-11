import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { createScript } from "./script.service.js";
import { generateSceneAudio } from "./audio.service.js";
import { directScene } from "./director.service.js";
import { getWordTimings } from "./transcribe.service.js";
import { buildLessonProps } from "../utils/timeline.js";
import { renderLessonVideo, cleanupJob } from "./render.service.js";

export const runLessonPipeline = async ({ topic, grade_level }) => {
  const jobId = crypto.randomUUID();
  const jobDir = path.join(process.cwd(), "temp", jobId);
  const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
  const keepTemp = process.env.KEEP_TEMP === "true";
  // makking calls to module 2 - serp API
  // initial setup to to never throw and can return "" - but in future will make it mandatory.
  // const grounding = await getGroundingResearchContext(topic);
  // console.log(grounding);
  // console.log(1);
  // making calls to module 3 scriptgeneration

  try {
    // Modules 2 + 3
    const { script, grounded, sources } = await createScript({
      topic,
      grade_level,
    });

    const audio = await generateSceneAudio(
      script.scenes, //scenes object from script
      path.join(jobDir, "audio") //where to output the result
    );

    console.log(audio);
    // audio: [{
    //   scene: 1,
    //   audioPath: 'D:\\FYP\\Learnify\\Backend\\temp\\64d8aa2c-62f3-4e0e-ae30-a00d97101b7c\\audio\\scene-01.wav',
    //   durationSec: 12.091
    // }],

    const scenes = script.scenes.map((scene, i) => ({ ...scene, ...audio[i] }));

    // Module 5: storyboard (AI) + word timings
    const storyboards = await Promise.all(scenes.map((s) => directScene(s)));
    const wordsByScene = [];
    for (const s of scenes) wordsByScene.push(await getWordTimings(s)); // sequential: whisper is CPU heavy

    const lessonProps = buildLessonProps({
      scenes,
      storyboards,
      wordsByScene,
      baseUrl,
      jobId,
    });

    // Module 6: render
    await renderLessonVideo({ jobId, lessonProps });

    if (keepTemp) {
      // lets you open the exact same video in Remotion Studio: --props=outputs/<jobId>.props.json
      await fs.writeFile(
        path.join(process.cwd(), "outputs", `${jobId}.props.json`),
        JSON.stringify(lessonProps, null, 2)
      );
    }

    return {
      jobId,
      videoUrl: `${baseUrl}/outputs/${jobId}.mp4`,
      script: { ...script, scenes },
      storyboards,
      grounded,
      sources,
    };
  } catch (error) {
  } finally {
    if (!keepTemp) await cleanupJob(jobDir);
  }
};
