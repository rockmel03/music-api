import mongoose, { Schema } from "mongoose";

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    album: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // In seconds
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    coverImage: {
      type: String, // URL of the cover image
      trim: true,
    },
    audioFileUrl: {
      type: String, // URL of the song file
      required: true,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
