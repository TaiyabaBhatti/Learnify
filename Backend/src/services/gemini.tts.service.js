import { GoogleGenAI } from "@google/genai";

// confirm the exact ID in AI Studio
const VOICE = process.env.TTS_VOICE || "Kore";
const STYLE =
  "Say in a warm, clear, friendly teacher's voice for school children, at a calm pace: ";

let client;
const getClient = () =>
  (client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function generateSpeech(text, { retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await getClient().models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: STYLE + text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
          },
        },
      });

      const inline = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!inline?.data) throw new Error("No audio returned from TTS model");

      return {
        data: Buffer.from(inline.data, "base64"),
        mimeType: inline.mimeType,
      };
    } catch (err) {
      const status = err.status ?? err.code;
      const fatal = [400, 401, 403, 404].includes(status);
      if (fatal || attempt >= retries) throw err;
      await sleep(2000 * 2 ** attempt); // 2s, 4s, 8s
    }
  }
}
