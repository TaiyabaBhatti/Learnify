import { SCRIPT_VALIDATOR } from "../validator/script.validator.js";

import { geminiScriptService } from "../services/gemini.script.service.js";
import { getGroundingResearchContext } from "../services/grounding.service.js";

export const generateScript = async (req, res, next) => {
  try {
    //  va;idaying input - later it will done with zod
    const { topic, grade_level } = req.body;
    console.log(req.body);
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // makking calls to module 2 - serp API
    // initial setup to to never throw and can return "" - but in future will make it mandatory.
    const grounding = await getGroundingResearchContext(topic);

    // making calls to module 3 scriptgeneration
    const responseScript = await geminiScriptService({
      topic,
      grade_level,
      ...grounding?.context,
    });

    const parsedJson = JSON.parse(responseScript.text);
    const result = SCRIPT_VALIDATOR.safeParse(parsedJson);

    if (!result.success) {
      console.log("Script validation fails: ", result.error.issues);
      return res.status(502).json({ error: "Validation fails" });
    }

    console.log(result.data);
    res.json({
      success: true,
      script: result.data,
      grounded: !!grounding,
      sources: grounding?.sources ?? [],
    });
  } catch (err) {
    console.error("Script generetion error:", err.message);
    res.status(500).json({ error: "Failed to generate script. Trry again." });
  }
};
