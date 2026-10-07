import { z } from "zod";

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
