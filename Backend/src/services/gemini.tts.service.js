import { GoogleGenAI } from "@google/genai";

const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSpeech(text) {
  const response = await genAi.models.generateContent({
    model: "gemini-3.8-flash-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { voice: "Kore" },
      },
    },
  });
  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!data) throw new Error("No audio returned from TTS model");
  return Buffer.from(data, "base64"); // raw PCM
}
