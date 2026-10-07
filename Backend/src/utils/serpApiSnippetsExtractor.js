// Responsibility: raw SerpAPI JSON in -> up to MAX_SNIPPETS clean fact objects out.
// Pure function: no network, no caching, no logging.
//
// Output item: { text, link, host, kind }  (kind: answer_box | knowledge_graph | organic)
//
// Priority: answer_box > knowledge_graph.description > organic snippets
// (organic: trusted domains first, then Google's original order).

const MAX_SNIPPETS = 3;
const MIN_LEN = 40; // shorter than this is rarely a useful fact
const MAX_LEN = 300; // organic snippets: keep the grounding string small
const KG_MAX_LEN = 400; // knowledge graph text is cleaner, allow a bit more

// Sites whose snippets are entertainment / social / homework-answer oriented.
const BLOCKED_DOMAINS = [
  "youtube.com",
  "reddit.com",
  "imdb.com",
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "pinterest.com",
  "linkedin.com",
  "quora.com",
  "chegg.com",
  "brainly.com",
  "vaia.com",
  "coursehero.com",
  "tripadvisor.com",
  "yelp.com",
];

// Sites we prefer.
const TRUSTED_DOMAINS = [
  "wikipedia.org",
  "britannica.com",
  "nasa.gov",
  "khanacademy.org",
  "nationalgeographic.com",
  "history.com",
  "physicsclassroom.com",
];

// Shop / marketing language. A blocklist of domains can never keep up
// with every shop, so also reject snippets that read like an advert.
const PROMO_PATTERN =
  /\b(sign up|subscribe|rewards|free (?:delivery|shipping)|shop now|buy now|order online|add to cart|\d+% off|store locator)\b/i;

// Periods after these do NOT end a sentence.
const ABBREVIATIONS =
  /\b(?:e\.g|i\.e|etc|vs|approx|Dr|Mr|Mrs|Ms|Prof|St|Bros|Inc|Ltd|Co|No|Fig|U\.S)$/;

// ---------- helpers ----------

const hostnameOf = (link) => {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const matchesDomain = (host, list) =>
  list.some((d) => host === d || host.endsWith(`.${d}`));

const isTrusted = (host) =>
  matchesDomain(host, TRUSTED_DOMAINS) ||
  host.endsWith(".gov") ||
  host.endsWith(".edu");

// Is text[i] the end of a real sentence?
const isSentenceEnd = (text, i) => {
  const ch = text[i];
  if (ch !== "." && ch !== "!" && ch !== "?") return false;
  // Must be followed by whitespace or end of text: "3.14" and "e.g.x" are not ends.
  if (i + 1 < text.length && !/\s/.test(text[i + 1])) return false;
  // "Bros." / "U.S." / "e.g." are abbreviations, not ends.
  if (ch === "." && ABBREVIATIONS.test(text.slice(0, i))) return false;
  return true;
};

// Index of the last real sentence end at or before `limit` (or -1).
const lastSentenceEnd = (text, limit = text.length - 1) => {
  for (let i = Math.min(limit, text.length - 1); i >= 0; i--) {
    if (isSentenceEnd(text, i)) return i;
  }
  return -1;
};

// "Mar 12, 2021 — ", "12 Mar 2021 · ", "3 days ago - " at the start.
const LEADING_DATE =
  /^(?:[A-Z][a-z]{2,8}\.? \d{1,2}, \d{4}|\d{1,2} [A-Z][a-z]{2,8} \d{4}|\d+ (?:hour|day|week|month|year)s? ago)\s*[—–\-·]\s*/;

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim(); // the u flag is required for \p{...}

// Duplicate if one text contains the other (e.g. the Wikipedia organic
// snippet is just the first sentence of the knowledge-graph description).
const isDuplicate = (text, seenNormalized) => {
  const n = normalize(text);
  return seenNormalized.some((s) => s.includes(n) || n.includes(s));
};

/**
 * Clean one raw snippet. Returns "" if nothing usable is left.
 * Exported so it can be unit-tested directly.
 */
export const cleanSnippet = (text, maxLen = MAX_LEN) => {
  if (typeof text !== "string") return "";

  let t = text
    .replace(/"{3,}/g, '"') // the prompt fences context with """ - never let a snippet break out
    .replace(/\s+/g, " ")
    .trim();

  t = t.replace(LEADING_DATE, "");
  t = t.replace(/^(\.{3}|…)\s*/, ""); // leading "..."

  const truncated = /(\.{3}|…)\s*$/.test(t);
  t = t.replace(/(\.{3}|…)\s*$/, "").trim();

  if (!t) return "";
  if (/^[a-z]/.test(t)) return ""; // starts mid-sentence: a fragment, not a fact

  // Incomplete ending -> keep whole sentences only.
  if (truncated || !/[.!?]$/.test(t)) {
    const end = lastSentenceEnd(t);
    if (end === -1) return "";
    t = t.slice(0, end + 1);
  }

  // Too long -> cut back to the last whole sentence that fits.
  if (t.length > maxLen) {
    const end = lastSentenceEnd(t, maxLen - 1);
    if (end === -1) return "";
    t = t.slice(0, end + 1);
  }

  return t.length >= MIN_LEN ? t : "";
};

// ---------- candidate sources (each returns raw candidates, unfiltered) ----------

// Shape varies by query type; guard everything. Not present in every response.
const fromAnswerBox = (data) => {
  const box = data?.answer_box;
  const raw = [box?.answer, box?.snippet].find((v) => typeof v === "string");
  if (!raw) return [];
  const link = typeof box.link === "string" ? box.link : "";
  return [
    {
      raw,
      link,
      host: hostnameOf(link),
      kind: "answer_box",
      maxLen: KG_MAX_LEN,
    },
  ];
};

const fromKnowledgeGraph = (data) => {
  const kg = data?.knowledge_graph;
  if (typeof kg?.description !== "string") return [];
  const link = typeof kg.source?.link === "string" ? kg.source.link : "";
  return [
    {
      raw: kg.description,
      link,
      host: hostnameOf(link),
      kind: "knowledge_graph",
      maxLen: KG_MAX_LEN,
    },
  ];
};

// Drop blocked/invalid hosts, put trusted domains first, keep Google's order otherwise.
const fromOrganic = (data) => {
  const results = Array.isArray(data?.organic_results)
    ? data.organic_results
    : [];

  return results
    .map((r, index) => ({ r, index, host: hostnameOf(r?.link) }))
    .filter(
      ({ r, host }) =>
        host !== "" &&
        typeof r.snippet === "string" &&
        !matchesDomain(host, BLOCKED_DOMAINS)
    )
    .sort(
      (a, b) =>
        Number(isTrusted(b.host)) - Number(isTrusted(a.host)) ||
        a.index - b.index
    )
    .map(({ r, host }) => ({
      raw: r.snippet,
      link: r.link,
      host,
      kind: "organic",
      maxLen: MAX_LEN,
    }));
};

/**
 * @param {object} data  raw SerpAPI JSON
 * @returns {{text:string, link:string, host:string, kind:string}[]}
 *          up to MAX_SNIPPETS items (possibly empty)
 */
export const extractSnippets = (data) => {
  const candidates = [
    ...fromAnswerBox(data),
    ...fromKnowledgeGraph(data),
    ...fromOrganic(data),
  ];

  const selected = [];
  const seen = [];

  for (const c of candidates) {
    const text = cleanSnippet(c.raw, c.maxLen);
    if (!text) continue;
    if (PROMO_PATTERN.test(text)) continue;
    if (isDuplicate(text, seen)) continue;

    seen.push(normalize(text));
    selected.push({ text, link: c.link, host: c.host, kind: c.kind });
    if (selected.length === MAX_SNIPPETS) break;
  }

  return selected;
};
