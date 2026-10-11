// Turns a cue phrase (copied from the narration) into a start time using word timings.
export const normWord = (w = "") => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
export const tokens = (s = "") => s.split(/\s+/).map(normWord).filter(Boolean);

/**
 * @param {string} cue
 * @param {{word:string,start:number,end:number}[]} words
 * @param {number} fromIndex search cursor (keeps repeated phrases in order)
 * @returns {{index:number,startSec:number}|null}
 */
export const resolveCue = (cue, words, fromIndex = 0) => {
  const target = tokens(cue);
  if (!target.length || !words.length) return null;
  const norm = words.map((w) => normWord(w.word));

  const find = (t, start) => {
    for (let i = Math.max(0, start); i <= norm.length - t.length; i++) {
      if (t.every((tok, k) => norm[i + k] === tok)) return i;
    }
    return -1;
  };

  const attempts = [
    [target, fromIndex],
    [target, 0],
    [[target[0]], fromIndex],
    [[target[0]], 0],
  ];
  for (const [t, start] of attempts) {
    const i = find(t, start);
    if (i !== -1) return { index: i, startSec: words[i].start };
  }
  return null;
};
