import {
  SYSTEM_PROMPT,
  RESPONSE_SCHEMA,
  SCRIPT_VALIDATOR,
} from "../utlis/script.format.js";
import { GoogleGenAI } from "@google/genai"; //SDK

export const generateScript = async (req, res, next) => {
  try {
    const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { topic, grade_level } = req.body;

    console.log(req.body);

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const response = await genAi.models.generateContent({
      // we need to continuously track implemented model for - updates and model related info - sometime the model get removed for archieve.
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Topic: "${topic.trim()}"\nGrade Level: ${grade_level}\n\nGenerate the lesson script JSON now.`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        responseMimeType: "application/json", //constarints
        responseSchema: RESPONSE_SCHEMA, //schema constarints
      },
    });

    const parsedJson = JSON.parse(response.text);
    const result = SCRIPT_VALIDATOR.safeParse(parsedJson);

    if (!result.success) {
      console.log("Script validation fails: ", result.error.issues);
      return res.status(502).json({ error: "Validation fails" });
    }

    console.log(result.data);
    res.json({ success: true, script: result.data });
  } catch (err) {
    console.error("Script generetion error:", err.message);
    res.status(500).json({ error: "Failed to generate script. Trry again." });
  }
};
