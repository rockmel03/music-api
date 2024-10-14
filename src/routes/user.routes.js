import {
  getUserProfile,
  login,
  refreshToken,
  register,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

//Register User
router.route("/register").post(register);

//Login User
router.route("/login").post(login);

//Refresh Token
router.route("/refresh").post(refreshToken);

//Get user profile (protected route)
router.route("/profile").get(authMiddleware, getUserProfile);

export default router;
