import path from "path";
import fs from "fs/promises";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

let bundlePromise;
// Bundle once per server process (slow), reuse for every render.
const getBundle = () => {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.jsx"),
    }).catch((e) => {
      bundlePromise = undefined;
      throw e;
    });
  }
  return bundlePromise;
};

export const renderLessonVideo = async ({ jobId, lessonProps }) => {
  const serveUrl = await getBundle();
  const outDir = path.join(process.cwd(), "outputs");
  await fs.mkdir(outDir, { recursive: true });
  const outputLocation = path.join(outDir, `${jobId}.mp4`);

  const composition = await selectComposition({
    serveUrl,
    id: "Lesson",
    inputProps: lessonProps,
  });
  let lastPct = -10;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps: lessonProps,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastPct + 10) {
        lastPct = pct;
        console.log(`[render] ${pct}%`);
      }
    },
  });
  return outputLocation;
};

export const cleanupJob = (jobDir) =>
  fs.rm(jobDir, { recursive: true, force: true });
