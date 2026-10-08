import { runLessonPipeline } from "../services/pipeline.service.js";

export const generateLesson = async (req, res, next) => {
  try {
    //  va;idaying input - later it will done with zod
    const { topic, grade_level } = req.body;
    console.log(req.body);
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }
    const result = await runLessonPipeline({ topic, grade_level });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
