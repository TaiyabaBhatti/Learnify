import { Type } from "@google/genai";
import { z } from "zod";

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    grade_level: { type: Type.STRING },
    learning_objectives: { type: Type.STRING },
    scenes: {
      type: Type.ARRAY,
      minItems: 4,
      maxItems: 4,
      items: {
        type: Type.OBJECT,
        properties: {
          scene_number: { type: Type.INTEGER },
          title: { type: Type.STRING },
          narration: { type: Type.STRING },
          key_concept: { type: Type.STRING },
          visual_hint: { type: Type.STRING },
          emoji: { type: Type.STRING },
        },
        required: [
          "scene_number",
          "title",
          "narration",
          "key_concept",
          "visual_hint",
          "emoji",
        ],
        propertyOrdering: [
          "scene_number",
          "title",
          "narration",
          "key_concept",
          "visual_hint",
          "emoji",
        ],
      },
    },
    follow_up_questions: {
      type: Type.ARRAY,
      minItems: 3,
      maxItems: 3,
      items: { type: Type.STRING },
    },
  },
  required: [
    "topic",
    "grade_level",
    "learning_objectives",
    "scenes",
    "follow_up_questions",
  ],
  propertyOrdering: [
    "topic",
    "grade_level",
    "learning_objectives",
    "scenes",
    "follow_up_questions",
  ],
};

export const SYSTEM_PROMPT = `You are Learnify, an AI educational assistant. 
  Convert any topic into a structured lesson script. 
Rules:
- Always 4 scenes
- Narration: 2-4 simple sentences, age-appropriate vocabulary
- key_concept: one sentence, the single most important takeaway
- visual_hint: describe a whiteboard drawing that would illustrate this scene
- follow_up_questions: 3 short comprehension questions
  
  `;

export const SCRIPT_VALIDATOR = z.object({
  topic: z.string().min(1),
  grade_level: z.string().min(1),
  learning_objectives: z.string().min(1),
  scenes: z
    .array(
      z.object({
        scene_number: z.number().int(),
        title: z.string().min(1),
        narration: z.string().min(20),
        key_concept: z.string().min(1),
        visual_hint: z.string().min(1),
        emoji: z.string().min(1),
      })
    )
    .length(4),
  follow_up_questions: z.array(z.string().min(1)).length(3),
});
