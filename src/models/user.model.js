import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "artist"],
      default: "user",
    },
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
    artistProfile: {
      bio: {
        type: String,
        required: function () {
          return this.role === "artist";
        },
      },
      portfolio: {
        type: [String], // URLs of the artist's portfolio or artwork
        required: function () {
          return this.role === "artist";
        },
      },
      socialMedia: {
        website: String,
        instagram: String,
        twitter: String,
      },
    },
  },
  { timestamps: true }
);

// Optionally, a method to check if user is an artist
UserSchema.methods.isArtist = function () {
  return this.role === "artist";
};

// Encrypt password
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Method to compare password with hashed password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
UserSchema.methods.generateAccessToken = function () {
  const payload = {
    id: this._id,
    username: this.username,
    role: this.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }); // 15 minutes expiration
};

// Method to generate a refresh token
UserSchema.methods.generateRefreshToken = function () {
  const payload = {
    id: this._id,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }); // 7 days expiration
};

const User = mongoose.model("User", UserSchema);
export default User;
