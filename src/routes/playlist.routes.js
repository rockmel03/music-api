import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  removeSongFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
const router = express.Router();

router
  .route("/")
  .get(getAllPlaylists) // Get all playlists (public/private filtering and pagination)
  .post(authMiddleware, createPlaylist); // Create a playlist

router
  .route("/:id")
  .get(getPlaylistById) // Get a single playlist by ID
  .put(authMiddleware, updatePlaylist) // Update a playlist
  .delete(authMiddleware, deletePlaylist); // Delete a playlist

// Add a song to the playlist
router.put("/:id/add-song", authMiddleware, addSongToPlaylist);

// Remove a song from the playlist
router.put("/:id/remove-song", authMiddleware, removeSongFromPlaylist);

export default router;
