import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();
// register a user
router.route("/register").post(singleUpload,register);
// login 
router.route("/login").post(login);
// logout
router.route("/logout").get(logout);
// update user info (mainly for NGOs)
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;