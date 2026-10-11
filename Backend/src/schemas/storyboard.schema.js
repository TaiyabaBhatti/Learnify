import { z } from "zod";
import { Type } from "@google/genai";
import { ICON_NAMES } from "./iconNames.js";

export const LAYOUTS = ["flow", "grid", "hub", "list"];
export const ELEMENT_TYPES = ["title", "text", "box", "icon", "line"];

// ---------- zod (our validation) ----------
const element = z.object({
  id: z.string().min(1),
  type: z.enum(ELEMENT_TYPES),
  cue: z.string().min(1),
  text: z.string().nullish(),
  label: z.string().nullish(),
  name: z.enum(ICON_NAMES).nullish(),
  from: z.string().nullish(),
  to: z.string().nullish(),
  style: z.enum(["normal", "accent"]).nullish(),
});

export const storyboardSchema = z
  .object({
    layout: z.enum(LAYOUTS),
    elements: z.array(element).min(1).max(12),
  })
  .superRefine((sb, ctx) => {
    const bad = (message) => ctx.addIssue({ code: "custom", message });
    const ids = new Set();
    let titles = 0;
    for (const e of sb.elements) {
      if (ids.has(e.id)) bad(`duplicate id "${e.id}"`);
      ids.add(e.id);
      if (e.type === "title") {
        titles++;
        if (!e.text) bad(`title "${e.id}" needs text`);
      }
      if (e.type === "text" && !e.text) bad(`text "${e.id}" needs text`);
      if (e.type === "box" && !e.label) bad(`box "${e.id}" needs label`);
      if (e.type === "icon" && !e.name) bad(`icon "${e.id}" needs name`);
      if (e.type === "line" && (!e.from || !e.to))
        bad(`line "${e.id}" needs from and to`);
    }
    if (titles > 1) bad("only one title allowed");
    const nodeIds = new Set(
      sb.elements
        .filter((e) => e.type === "box" || e.type === "icon")
        .map((e) => e.id)
    );
    for (const e of sb.elements.filter((x) => x.type === "line")) {
      if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) {
        bad(
          `line "${e.id}" must connect existing box/icon ids (got ${e.from} -> ${e.to})`
        );
      }
    }
  });

// ---------- Gemini responseSchema (flat on purpose: unions are unreliable) ----------
export const storyboardResponseSchema = {
  type: Type.OBJECT,
  properties: {
    layout: { type: Type.STRING, enum: LAYOUTS },
    elements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ELEMENT_TYPES },
          cue: { type: Type.STRING },
          text: { type: Type.STRING },
          label: { type: Type.STRING },
          name: { type: Type.STRING, enum: ICON_NAMES },
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          style: { type: Type.STRING, enum: ["normal", "accent"] },
        },
        required: ["id", "type", "cue"],
      },
    },
  },
  required: ["layout", "elements"],
};
