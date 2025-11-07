import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    applyDonation, 
    getApplicantsForDonation, 
    getAppliedDonations, 
    updateApplicationStatus 
} from "../controllers/application.controller.js";

const router = express.Router();

// NGO applies for a donation
router.route("/apply/:id").post(isAuthenticated, applyDonation);

// NGO views all donations they have applied for
router.route("/get").get(isAuthenticated, getAppliedDonations);

// Donor views all applicants (NGOs) for a specific donation
router.route("/:id/applicants").get(isAuthenticated, getApplicantsForDonation);

// Donor updates the status (accepted or rejected)
router.route("/status/:id/update").post(isAuthenticated, updateApplicationStatus);

export default router;