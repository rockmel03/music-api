import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createSong,
  deleteSong,
  getAllSongs,
  getSongById,
  updateSong,
} from "../controllers/song.controller.js";
const router = express.Router();

router
  .route("/")
  .get(getAllSongs) // Get all songs
  .post(authMiddleware, createSong); // Create a new song (protected)

router
  .route("/:id")
  .get(getSongById) // Get a song by ID
  .put(authMiddleware, updateSong) // Update a song by ID (protected)
  .delete(authMiddleware, deleteSong); // Delete a song by ID (protected))

export default router;
