export const friendlyErrorMessage = (err) => {
  const raw = String(err?.message ?? err);
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(raw)) {
    const m = raw.match(/retry in ([0-9a-z.]+)/i);
    const wait = m ? m[1].replace(/\.\d+s$/, "s") : null;
    return `The free daily limit of the AI voice service has been reached${
      wait ? `. It resets in about ${wait}` : ""
    }.`;
  }
  if (/503|overloaded|UNAVAILABLE/i.test(raw)) {
    return "The AI service is busy right now. Please try again in a moment.";
  }
  return raw.length > 200 ? `${raw.slice(0, 200)}...` : raw;
};
