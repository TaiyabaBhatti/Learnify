import { SCRIPT_VALIDATOR } from "../validator/script.validator.js";
import { geminiScriptService } from "./gemini.script.service.js";
import { getGroundingResearchContext } from "./grounding.service.js";

export const createScript = async ({ topic, grade_level }) => {
  const grounding = await getGroundingResearchContext(topic);

  const response = await geminiScriptService({
    topic,
    grade_level,
    ...grounding?.context,
  });
  const result = SCRIPT_VALIDATOR.safeParse(JSON.parse(response.text));
  if (!result.success) {
    console.log("Script validation fails: ", result.error.issues);
    return res.status(502).json({ error: "Validation fails" });
  }
  return {
    script: result.data,
    grounded: !!grounding,
    sources: grounding?.sources ?? [],
  };
};
