// Simulated pipeline for UI demos/recordings: same reporter calls as the real one,
// but no AI, no TTS and no render, so it never touches quota and never fails.
// DEMO_SPEED=1 is normal; DEMO_SPEED=0.5 makes everything twice as slow (nice for recording).
const speed = () => Number(process.env.DEMO_SPEED) || 1;
const wait = (ms) => new Promise((r) => setTimeout(r, ms / speed()));

const runDemo = async (reporter, { videoUrl, topic = "your topic" }) => {
  reporter.stageStart("input", "Checking your topic and grade level");
  await wait(800);
  reporter.stageDone("input", `Topic accepted: "${topic}"`);

  reporter.stageStart(
    "grounding",
    "Searching the web for reliable facts about this topic"
  );
  await wait(1200);
  reporter.detail("grounding", "Reading the top search results", 0.5);
  await wait(1200);
  reporter.stageDone(
    "grounding",
    "Found 3 reference snippets to keep the facts accurate"
  );

  reporter.stageStart("script", "Gemini is writing the lesson script");
  await wait(3000);
  reporter.stageDone(
    "script",
    "Script ready: 4 scenes, with a learning objective and quiz questions"
  );

  reporter.stageStart("voice", "Recording narration for 4 scenes");
  for (let i = 1; i <= 4; i++) {
    await wait(1400);
    reporter.detail("voice", `Narration recorded: scene ${i} of 4`, i / 4);
  }
  reporter.stageDone("voice", "Narration complete (56 seconds of audio)");

  reporter.stageStart(
    "storyboard",
    "Planning what appears on screen for each scene"
  );
  for (let i = 1; i <= 4; i++) {
    await wait(1100);
    reporter.detail(
      "storyboard",
      `Storyboard ready for scene ${i} of 4`,
      (i / 4) * 0.6
    );
  }
  for (let i = 1; i <= 4; i++) {
    await wait(700);
    reporter.detail(
      "storyboard",
      `Syncing scene ${i} of 4 to the spoken words`,
      0.6 + 0.4 * (i / 4)
    );
  }
  reporter.stageDone(
    "storyboard",
    "Animation plan ready: every element is timed to the narration"
  );

  reporter.stageStart("video", "Starting the video renderer");
  await wait(1200);
  for (let p = 0; p <= 100; p += 4) {
    await wait(350);
    reporter.detail("video", `Rendering the video: ${p}%`, p / 100);
  }
  reporter.stageDone("video", "Video rendered");
  reporter.complete({ videoUrl });
};

export default runDemo;
