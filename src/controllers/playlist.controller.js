import Playlist from "../models/playlist.model.js";
import Song from "../models/song.model.js";

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, songs, isPublic } = req.body;

    // Validate songs if provided
    if (songs && songs.length > 0) {
      const validSongs = await Song.find({ _id: { $in: songs } });
      if (validSongs.length !== songs.length) {
        return res
          .status(400)
          .json({ message: "One or more song IDs are invalid" });
      }
    }

    // Create the playlist
    const playlist = new Playlist({
      name,
      description,
      songs,
      createdBy: req.user.id, // Authenticated user is the creator
      isPublic,
    });

    await playlist.save();
    res
      .status(201)
      .json({ message: "Playlist created successfully", playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all playlists (with optional public/private filtering and pagination)
export const getAllPlaylists = async (req, res) => {
  try {
    const { page = 1, limit = 10, isPublic } = req.query;

    const filter = {};
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === "true"; // Convert to boolean
    }

    const playlists = await Playlist.find(filter)
      .populate("createdBy", "username")
      .populate("songs", "title artist")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Playlist.countDocuments(filter);

    res.status(200).json({
      playlists,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single playlist by ID
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("songs", "title artist album");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a playlist (only the creator can update)
export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, songs, isPublic } = req.body;

    // Find the playlist
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only allow the creator to update
    if (playlist.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this playlist" });
    }

    // Validate songs if provided
    if (songs && songs.length > 0) {
      const validSongs = await Song.find({ _id: { $in: songs } });
      if (validSongs.length !== songs.length) {
        return res
          .status(400)
          .json({ message: "One or more song IDs are invalid" });
      }

      playlist.songs = songs;
    }

    // Update other fields
    if (name) playlist.name = name;
    if (description) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();
    res
      .status(200)
      .json({ message: "Playlist updated successfully", playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a playlist (only the creator can delete)
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only allow the creator to delete
    if (playlist.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this playlist" });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a song to the playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only allow the creator to add songs
    if (playlist.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to add songs to this playlist",
      });
    }

    if (!req.body.songId) {
      return res.status(400).json({ message: "SongId is required" });
    }

    // Validate the song ID
    const song = await Song.findById(req.body.songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Add the song to the playlist (if it's not already in the list)
    if (!playlist.songs.includes(song._id)) {
      playlist.songs.push(song._id);
      await playlist.save();
      res.status(200).json({ message: "Song added to playlist", playlist });
    } else {
      res.status(400).json({ message: "Song is already in the playlist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a song from the playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only allow the creator to remove songs
    if (playlist.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to remove songs from this playlist",
      });
    }

    // Remove the song from the playlist
    const songIndex = playlist.songs.indexOf(req.body.songId);
    if (songIndex > -1) {
      playlist.songs.splice(songIndex, 1);
      await playlist.save();
      res.status(200).json({ message: "Song removed from playlist", playlist });
    } else {
      res.status(400).json({ message: "Song not found in the playlist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
