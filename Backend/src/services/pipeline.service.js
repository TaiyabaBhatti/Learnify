import crypto from "crypto";
import path from "path";
import { getGroundingResearchContext } from "./grounding.service.js";
import { geminiScriptService } from "./gemini.script.service.js";
import { createScript } from "./script.service.js";
import { generateSceneAudio } from "./audio.service.js";

export const runLessonPipeline = async ({ topic, grade_level }) => {
  const jobId = crypto.randomUUID();
  const jobDir = path.join(process.cwd(), "temp", jobId);

  // makking calls to module 2 - serp API
  // initial setup to to never throw and can return "" - but in future will make it mandatory.
  // const grounding = await getGroundingResearchContext(topic);
  // console.log(grounding);
  // console.log(1);
  // making calls to module 3 scriptgeneration

  // Modules 2 + 3
  const { script, grounded, sources } = await createScript({
    topic,
    grade_level,
  });

  console.log(script);

  const audio = await generateSceneAudio(
    script.scenes,
    path.join(jobDir, "audio")
  );

  const scenes = script.scenes.map((scene, i) => ({ ...scene, ...audio[i] }));
  return { jobId, jobDir, script: { ...script, scenes }, grounded, sources };
};
