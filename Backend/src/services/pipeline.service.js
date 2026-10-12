import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { createScript } from "./script.service.js";
import { generateSceneAudio } from "./audio.service.js";
import { directScene } from "./director.service.js";
import { getWordTimings } from "./transcribe.service.js";
import { buildLessonProps } from "../utils/timeline.js";
import { renderLessonVideo, cleanupJob } from "./render.service.js";
import { noopReporter } from "../jobs/reporter.js";
import { friendlyErrorMessage } from "../utils/friendlyErrorMessages.js";

export const runLessonPipeline = async (
  { topic, grade_level },
  { jobId = crypto.randomUUID(), reporter = noopReporter } = {}
) => {
  const jobDir = path.join(process.cwd(), "temp", jobId);
  const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5000";
  const keepTemp = process.env.KEEP_TEMP === "true";
  let stage = "input"; // so a failure can say WHICH stage broke

  // makking calls to module 2 - serp API
  // initial setup to to never throw and can return "" - but in future will make it mandatory.
  // const grounding = await getGroundingResearchContext(topic);
  // console.log(grounding);
  // console.log(1);
  // making calls to module 3 scriptgeneration

  try {
    // Modules 2 + 3
    // 1) INPUT (the controller already validated it; this makes it visible)
    reporter.stageStart("input", "Checking your topic and grade level");
    reporter.stageDone(
      "input",
      `Topic accepted: "${topic}"${grade_level ? ` for ${grade_level}` : ""}`
    );

    // 2) GROUNDING + 3) SCRIPT  (both live inside createScript)
    stage = "grounding";
    reporter.stageStart(
      "grounding",
      "Searching the web for reliable facts about this topic"
    );
    let groundingClosed = false;
    const closeGrounding = (grounded, count) => {
      if (groundingClosed) return;
      groundingClosed = true;
      if (grounded)
        reporter.stageDone(
          "grounding",
          `Found ${
            count ?? "some"
          } reference snippets to keep the facts accurate`
        );
      else
        reporter.stageSkipped(
          "grounding",
          "No reference material found, continuing without it"
        );
      stage = "script";
      reporter.stageStart("script", "Gemini is writing the lesson script");
    };

    const { script, grounded, sources } = await createScript({
      topic,
      grade_level,
      // optional hook: script.service.js calls onStage("grounding_done", { grounded, count })
      onStage: (step, info = {}) => {
        if (step === "grounding_done")
          closeGrounding(info.grounded, info.count);
      },
    });
    closeGrounding(grounded, sources?.length); // no-op if the hook already fired
    reporter.stageDone(
      "script",
      `Script ready: ${script.scenes.length} scenes, with a learning objective and quiz questions`
    );

    // 4) VOICE
    stage = "voice";
    const total = script.scenes.length;
    reporter.stageStart("voice", `Recording narration for ${total} scenes`);
    const audio = await generateSceneAudio(
      script.scenes,
      path.join(jobDir, "audio"),
      // optional hook: audio.service.js calls onProgress(done, total) after each scene
      (done, all) =>
        reporter.detail(
          "voice",
          `Narration recorded: scene ${done} of ${all ?? total}`,
          done / (all ?? total)
        )
    );
    const scenes = script.scenes.map((scene, i) => ({ ...scene, ...audio[i] }));
    const totalSec = audio.reduce((a, x) => a + (x.durationSec || 0), 0);
    reporter.stageDone(
      "voice",
      `Narration complete (${totalSec.toFixed(0)} seconds of audio)`
    );

    console.log(audio);
    // audio: [{
    //   scene: 1,
    //   audioPath: 'D:\\FYP\\Learnify\\Backend\\temp\\64d8aa2c-62f3-4e0e-ae30-a00d97101b7c\\audio\\scene-01.wav',
    //   durationSec: 12.091
    // }],

    // Module 5: storyboard (AI) + word timings
    // 5) STORYBOARD (director + word timings)
    stage = "storyboard";
    reporter.stageStart(
      "storyboard",
      "Planning what appears on screen for each scene"
    );
    let directed = 0;
    const storyboards = await Promise.all(
      scenes.map(async (s) => {
        const sb = await directScene(s);
        directed++;
        reporter.detail(
          "storyboard",
          `Storyboard ready for scene ${directed} of ${total}`,
          (directed / total) * 0.6
        );
        return sb;
      })
    );

    const wordsByScene = [];
    for (let i = 0; i < scenes.length; i++) {
      reporter.detail(
        "storyboard",
        `Syncing scene ${i + 1} of ${total} to the spoken words`,
        0.6 + 0.4 * (i / total)
      );
      wordsByScene.push(await getWordTimings(scenes[i]));
    }
    const lessonProps = buildLessonProps({
      scenes,
      storyboards,
      wordsByScene,
      baseUrl,
      jobId,
    });
    reporter.stageDone(
      "storyboard",
      "Animation plan ready: every element is timed to the narration"
    );

    // Module 6: render
    // 6) VIDEO
    stage = "video";
    reporter.stageStart("video", "Starting the video renderer");
    await renderLessonVideo({
      jobId,
      lessonProps,
      onProgress: (p, phase) =>
        phase === "bundling"
          ? reporter.detail(
              "video",
              "Preparing the renderer (the first run can take a minute)",
              0.05
            )
          : reporter.detail(
              "video",
              `Rendering the video: ${Math.round(p * 100)}%`,
              0.1 + 0.9 * p
            ),
    });
    reporter.stageDone("video", "Video rendered");

    if (keepTemp) {
      await fs.writeFile(
        path.join(process.cwd(), "outputs", `${jobId}.props.json`),
        JSON.stringify(lessonProps, null, 2)
      );
    }

    const result = {
      jobId,
      videoUrl: `${baseUrl}/outputs/${jobId}.mp4`,
      script: { ...script, scenes },
      storyboards,
      grounded,
      sources,
    };
    reporter.complete(result);
    return result;
  } catch (error) {
    reporter.fail(stage, friendlyErrorMessage(error));
    throw error;
  } finally {
    if (!keepTemp) await cleanupJob(jobDir);
  }
};
