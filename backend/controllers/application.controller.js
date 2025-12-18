import { Application } from "../models/application.model.js";
import { Donation } from "../models/donation.model.js";
import { handleDonationExpiry } from "../utils/donationExpiry.js";

// (NGO) applies for a donation
export const applyDonation = async (req, res) => {
    try {
        const userId = req.id;  // logged-in user (NGO)
        const donationId = req.params.id;

        if (!donationId) {
            return res.status(400).json({
                message: "Donation ID is required.",
                success: false
            });
        }


        const existingApplication = await Application.findOne({ donation: donationId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already requested this donation.",
                success: false
            });
        }

        // Check if the donation exists
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({
                message: "Donation not found.",
                success: false
            });
        }

        // Create a new donation request
        const newApplication = await Application.create({
            donation: donationId,
            applicant: userId,
        });

        donation.applications.push(newApplication._id);
        await donation.save();
        // after application is saved
        if (donation.quantity <= donation.applications.length) {
            donation.status = "expired";
            await donation.save();
        }

        if (donation.expiryAt && new Date(donation.expiryAt) <= new Date()) {
            donation.status = "expired";
            await donation.save();
        }

        await handleDonationExpiry();

        const updatedDonation = await Donation.findById(donationId)
            .populate({
                path: "applications",
                populate: { path: "applicant" }
            })
            .populate("donor");

        return res.status(201).json({
            message: "Donation requested successfully.",
            success: true,
            donation: updatedDonation
        });

    } catch (error) {
        console.log(error);
    }
};

// (NGO) can view all donations they have applied for
export const getAppliedDonations = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'donation',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'donor',
                    options: { sort: { createdAt: -1 } },
                }
            });

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No donation requests found.",
                success: false
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

// can view which users (NGOs) applied for their donation
export const getApplicantsForDonation = async (req, res) => {
    try {
        const donationId = req.params.id;
        const donation = await Donation.findById(donationId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });

        if (!donation) {
            return res.status(404).json({
                message: "Donation not found.",
                success: false
            });
        }

        return res.status(200).json({
            donation,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

// update the application (request) status (accepted/rejected)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
                success: false
            });
        }

        // Find application
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
