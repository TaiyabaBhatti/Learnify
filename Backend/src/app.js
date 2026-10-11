import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();

// configuring incoming request payload -  understanding of it - middlewares
app.use(cors());
app.use("/temp", express.static(path.join(process.cwd(), "temp")));
app.use("/outputs", express.static(path.join(process.cwd(), "outputs")));
// Large request body attacks
// Memory overload
app.use(express.json({ limit: "10kb" }));

// gettign data from url encode over specified limit - also accept nedted key va;ue pairs
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// routes
import scriptRoute from "./routes/script.route.js";
import pipelineRoute from "./routes/generate.route.js";
import { generateLesson } from "./controllers/pipeline.controller.js";

app.use("/api", scriptRoute);
// app.use("/api", generateAudio);
app.use("/api/lesson", pipelineRoute);

// middlewares

export default app;
