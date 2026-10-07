import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// configuring incoming request payload -  understanding of it - middlewares

// Large request body attacks
// Memory overload
app.use(express.json({ limit: "10kb" }));

// gettign data from url encode over specified limit - also accept nedted key va;ue pairs
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// routes
import scriptRoute from "./routes/script.route.js";
import generateAudio from "./routes/audio.route.js";

app.use("/api", scriptRoute);
app.use("/api", generateAudio);

// middlewares

export default app;
