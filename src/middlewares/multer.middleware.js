import multer from "multer";
import { randomBytes } from "crypto";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads"
    );

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, {
        recursive: true, // recursive true first check for parent directory is exists or not, if not then first create it automatically
      });
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + randomBytes(10).toString("hex");
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB file size limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|mp3|wav/; // Allowed file types

    // Check the file extension
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // Check the MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error("Only images and audio files are allowed!")); // Reject the file
    }
  },
});

export default upload;
