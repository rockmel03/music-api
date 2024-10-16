import express from "express";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { corsOptions } from "./config/cors.config.js";

config(); // dotenv configuration

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);

//router imports
import userRouter from "./routes/user.routes.js";
import songRouter from "./routes/song.routes.js";
import playlistRouter from "./routes/playlist.routes.js";

// routes
app.use("/users", userRouter);
app.use("/songs", songRouter);
app.use("/playlists", playlistRouter);

export default app;
