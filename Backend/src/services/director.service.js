import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  storyboardSchema,
  storyboardResponseSchema,
  LAYOUTS,
} from "../schemas/storyboard.schema.js";
import { ICON_NAMES } from "../schemas/iconNames.js";
import { tokens } from "../utils/cueResolver.js";
import { getNarration, getTitle, getVisualHint } from "../utils/scene.js";

const MODEL = "gemini-2.5-flash";
const MAX_ATTEMPTS = 3;
let ai;
const client = () =>
  (ai ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }));

const SYSTEM = `You are the animation director of a whiteboard teaching video.
You never draw. You output a storyboard that code will animate on a dark board while the narration plays.
Vocabulary (use only these element types):
- title: scene heading. text = heading. At most one, and it must be first.
- text: one short line (max 12 words) that is written on the board.
- box: a labelled rectangle (label).
- icon: a pictogram (name from the allowed list) with optional label.
- line: connects two existing box/icon ids (from, to). Draw lines AFTER both ends exist.
Rules:
- Every element needs a "cue": 1 to 4 consecutive words copied EXACTLY from the narration, marking the moment the element should appear.
- Elements must be in the order their cues are spoken.
- 3 to 9 elements per scene. Unique ids (short, lowercase).
- layout: flow (steps in a row), grid (parallel items), hub (first box/icon is the centre, others around it), list (mostly text).
- Prefer boxes/icons/lines to explain structure; use text for definitions.
- Use style "accent" on at most one box that is the key concept.`;

const buildPrompt = (scene, narration, lastError) => `
Scene title: ${getTitle(scene)}
Visual hint from the script writer: ${getVisualHint(scene)}
Allowed icon names: ${ICON_NAMES.join(", ")}
Allowed layouts: ${LAYOUTS.join(", ")}

Narration (cues must be copied from this text):
"""${narration}"""
${
  lastError
    ? `\nYour previous answer was rejected: ${lastError}\nFix these problems.`
    : ""
}`;

const errMsg = (e) =>
  e instanceof z.ZodError
    ? e.issues.map((i) => i.message).join("; ")
    : e.message;

const checkCues = (sb, narration) => {
  const hay = ` ${tokens(narration).join(" ")} `;
  const missing = sb.elements
    .filter((e) => !hay.includes(` ${tokens(e.cue).join(" ")} `))
    .map((e) => `"${e.cue}"`);
  if (missing.length)
    throw new Error(
      `cues not found verbatim in the narration: ${missing.join(", ")}`
    );
};

const fallbackStoryboard = (scene, narration) => {
  const first = (s) => s.split(/\s+/).slice(0, 3).join(" ");
  const sentences = narration
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 4);
  const elements = [
    {
      id: "title",
      type: "title",
      text: getTitle(scene),
      cue: first(narration) || "the",
    },
  ];
  sentences.forEach((s, i) =>
    elements.push({
      id: `t${i + 1}`,
      type: "text",
      text: s.slice(0, 90),
      cue: first(s),
    })
  );
  return { layout: "list", elements };
};

export const directScene = async (scene) => {
  const narration = getNarration(scene);
  let lastError = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await client().models.generateContent({
        model: MODEL,
        contents: buildPrompt(scene, narration, lastError),
        config: {
          systemInstruction: SYSTEM,
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: storyboardResponseSchema,
        },
      });
      const parsed = storyboardSchema.parse(JSON.parse(res.text));
      checkCues(parsed, narration);
      return parsed;
    } catch (e) {
      lastError = errMsg(e);
      console.warn(
        `[director] scene ${scene.scene} attempt ${attempt} failed: ${lastError}`
      );
    }
  }
  console.warn(`[director] scene ${scene.scene}: using fallback storyboard`);
  return fallbackStoryboard(scene, narration);
};
