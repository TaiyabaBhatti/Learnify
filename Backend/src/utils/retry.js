// Retries temporary Gemini problems (503 "high demand", network blips) with backoff.
// Quota errors (429) are NOT retried: waiting seconds cannot fix a daily limit.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const isTransient = (e) =>
  /503|UNAVAILABLE|overloaded|high demand|ECONNRESET|ETIMEDOUT|fetch failed/i.test(
    String(e?.message ?? e)
  );

export const withRetry = async (fn, { tries = 3, baseMs = 2000 } = {}) => {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!isTransient(e) || i === tries - 1) throw e;
      console.warn(
        `[retry] attempt ${i + 1} failed (temporary), retrying in ${
          (baseMs * 2 ** i) / 1000
        }s`
      );
      await wait(baseMs * 2 ** i);
    }
  }
  throw last;
};
