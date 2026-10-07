//calling serpAPI service
//passing result to snippet extractor
// calls to get research context.

import { serpApiSearch } from "./serpapi.service.js";
import { extractSnippets } from "../utils/serpApiSnippetsExtractor.js";

export const getGroundingResearchContext = async (topic) => {
  const result = (status, context = "", sources = []) => ({
    status,
    context,
    sources,
  });
  if (typeof topic !== "string" || !topic.trim()) return result("empty");

  // normalize topic

  const normalizeTopic = topic
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  try {
    // (cache lookup will go here later)

    const raw = await serpApiSearch(normalizeTopic);
    const snippets = extractSnippets(raw);

    if (snippets.length === 0) {
      const empty = result("empty");
      return empty;
    }

    const ok = result(
      "ok",
      snippets.map((s, i) => `${i + 1}. ${s.text}`).join("\n"),
      [...new Set(snippets.map((s) => s.link).filter(Boolean))]
    );

    return ok;
  } catch (error) {
    // Log the message
    console.warn("Grounding skipped:", error.message);
    return result("error");
  }
};
