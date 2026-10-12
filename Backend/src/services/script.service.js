import { SCRIPT_VALIDATOR } from "../validator/script.validator.js";
import { geminiScriptService } from "./gemini.script.service.js";
import { getGroundingResearchContext } from "./grounding.service.js";
import { withRetry } from "../utils/retry.js";

export const createScript = async ({ topic, grade_level, onStage }) => {
  const grounding = await getGroundingResearchContext(topic);
  const grounded = Boolean(grounding?.context);
  onStage?.("grounding_done", {
    grounded,
    count: grounding?.sources?.length,
  });

  const response = await withRetry(() =>
    geminiScriptService({
      topic,
      grade_level,
      ...grounding?.context,
    })
  );
  const result = SCRIPT_VALIDATOR.safeParse(JSON.parse(response.text));
  if (!result.success) {
    console.log("Script validation fails: ", result.error.issues);
    throw new Error("The generated script did not pass validation");
  }
  return {
    script: result.data,
    grounded: !!grounding,
    sources: grounding?.sources ?? [],
  };
};
