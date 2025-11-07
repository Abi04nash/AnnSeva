// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { 
//     postDonation, 
//     getAllDonations, 
//     getDonationById, 
//     getDonorDonations ,
//     updateDonation     
// } from "../controllers/donation.controller.js";

// const router = express.Router();

// // Donor will post a new donation
// router.route("/post").post(isAuthenticated, postDonation);

// // NGO will view all available donations
// router.route("/get").get(isAuthenticated, getAllDonations);

// // NGO will view donation details by ID
// router.route("/get/:id").get(isAuthenticated, getDonationById);

// // Donor can view all donations created by them
// router.route("/getdonordonations").get(isAuthenticated, getDonorDonations);

// // Donor can update a donation
// router.route("/update/:id").put(isAuthenticated, updateDonation);



// export default router;




import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  postDonation,
  getAllDonations,
  getDonationById,
  getDonorDonations,
  updateDonation,
} from "../controllers/donation.controller.js";

const router = express.Router();

// Donor will post a new donation
router.route("/post").post(isAuthenticated, postDonation);

// NGO will view all available donations
router.route("/get").get(isAuthenticated , getAllDonations);

// NGO will view donation details by ID
router.route("/get/:id").get(isAuthenticated, getDonationById);

// Donor can view all donations created by them
router.route("/getdonordonations").get(isAuthenticated, getDonorDonations);

// Donor can update a donation
router.route("/update/:id").put(isAuthenticated, updateDonation);

export default router;
