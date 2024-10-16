import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
