import Song from "../models/song.model.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a new song
export const createSong = async (req, res) => {
  try {
    // Access the uploaded files
    const audioFile = req.files["audioFile"] ? req.files["audioFile"][0] : null;
    const coverImageFile = req.files["coverImage"]
      ? req.files["coverImage"][0]
      : null;

    if (!audioFile || !coverImageFile) {
      return res
        .status(400)
        .json({ message: "Audio file and cover image are required" });
    }
    
    // Save file paths or URLs for audio file and cover image
    const audioFileUrl = `/uploads/${audioFile.filename}`;
    const coverImage = `/uploads/${coverImageFile.filename}`;

    const { title, artists, album, genre, duration, releaseDate } = req.body;

    // Validate that artists array is provided
    if (!artists || artists.length === 0) {
      return res.status(400).json({ message: "Artists are required" });
    }

    // Validate each artist ID exists in the database
    const validArtists = await User.find({ _id: { $in: artists } });

    if (validArtists.length !== artists.length) {
      return res
        .status(400)
        .json({ message: "One or more artist IDs are invalid" });
    }

    // Check if the file was uploaded
    if (req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create the song
    const song = new Song({
      title,
      artists, // Store the array of artist IDs
      album,
      genre,
      duration,
      releaseDate,
      audioFileUrl,
      coverImage,
    });

    await song.save();
    res.status(201).json({ message: "Song created successfully", song });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all songs
export const getAllSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10 items per page

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Get total number of songs for pagination info
    const totalSongs = await Song.countDocuments();

    // Fetch songs with pagination
    const songs = await Song.find()
      .skip(skip) // Skip items based on the page
      .limit(limit) // Limit the number of items per page
      .sort({ createdAt: -1 }); // Optional: Sort by creation date, newest first

    // Return paginated response
    res.status(200).json({
      songs,
      totalPages: Math.ceil(totalSongs / limit), // Calculate total pages
      currentPage: page,
      totalSongs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a song by ID
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a song
export const updateSong = async (req, res) => {
  try {
    const { title, artists, album, genre, duration, releaseDate } = req.body;

    // Find the song by its ID
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // If artists are provided, validate them
    if (artists && artists.length > 0) {
      const validArtists = await User.find({ _id: { $in: artists } });

      if (validArtists.length !== artists.length) {
        return res
          .status(400)
          .json({ message: "One or more artist IDs are invalid" });
      }

      // Update the artists list
      song.artists = artists;
    }

    // Access the uploaded files
    const audioFile = req.files["audioFile"] ? req.files["audioFile"][0] : null;
    const coverImageFile = req.files["coverImage"]
      ? req.files["coverImage"][0]
      : null;

    // Update uploaded files urls if provided

    if (audioFile) {
      // delete the previously uploaded files
      const previousFilePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        ...song.audioFileUrl.split("/")
      );

      fs.unlink(previousFilePath, (err) => {
        if (err) throw err;
        console.log(`${previousFilePath} was deleted`);
      });

      song.audioFileUrl = `/uploads/${audioFile.filename}`;
    }

    if (coverImageFile) {
      const previousFilePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        ...song.coverImage.split("/")
      );

      fs.unlink(previousFilePath, (err) => {
        if (err) throw err;
        console.log(`${previousFilePath} was deleted`);
      });

      song.coverImage = `/uploads/${coverImageFile.filename}`;
    }

    // Update other fields if provided
    if (title) song.title = title;
    if (album) song.album = album;
    if (genre) song.genre = genre;
    if (duration) song.duration = duration;
    if (releaseDate) song.releaseDate = releaseDate;

    // Save the updated song
    await song.save();
    res.status(200).json({ message: "Song updated successfully", song });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a song
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Check if the authenticated user is one of the collaborating artists
    const isAuthorized = song.artists.some(
      (artistId) => artistId.toString() === req.user.id
    );

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this song" });
    }

    // If the authenticated user is one of the collaborating artists, allow the deletion
    await Song.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
