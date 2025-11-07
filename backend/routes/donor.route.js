import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    registerDonor, getDonors, getDonorById, updateDonor 
} from "../controllers/donor.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Register a new donor
router.route("/register").post(isAuthenticated, registerDonor);

// Get all donors for the logged-in user
router.route("/get").get(isAuthenticated, getDonors);

// Get a donor by ID
router.route("/get/:id").get(isAuthenticated, getDonorById);

// Update donor information
router.route("/update/:id").put(isAuthenticated, singleUpload, updateDonor);

export default router;
