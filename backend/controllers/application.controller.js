import { Application } from "../models/application.model.js";
import { Donation } from "../models/donation.model.js";
import { handleDonationExpiry } from "../utils/donationExpiry.js";

// (NGO) applies for a donation
export const applyDonation = async (req, res) => {
    try {
        const userId = req.id;  // logged-in user (NGO)
        const donationId = req.params.id;
        const { requestedItems, requestedUnits } = req.body;

        if (!donationId) {
            return res.status(400).json({
                message: "Donation ID is required.",
                success: false
            });
        }

        if (!requestedItems || !requestedUnits) {
            return res.status(400).json({
                message: "Items and units are required",
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

        if (donation.quantity < requestedUnits) {
            return res.status(400).json({
                message: `Cannot request more than available. Only ${donation.quantity} units left.`,
                success: false
            });
        }

        // Create a new donation request
        const newApplication = await Application.create({
            donation: donationId,
            applicant: userId,
            requestedItems,
            requestedUnits
        });

        donation.applications.push(newApplication._id);
        await donation.save();
        
        // FIX REMOVED: The weird `donation.quantity <= donation.applications.length` check has been deleted.

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
        return res.status(500).json({ message: "Internal server error", success: false });
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
            return res.status(400).json({ message: "Status is required.", success: false });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        const donation = await Donation.findById(application.donation);
        if (!donation) {
            return res.status(404).json({ message: "Donation not found.", success: false });
        }

        const incomingStatus = status.toLowerCase();
        const currentStatus = application.status.toLowerCase();

        if (incomingStatus === 'approved' && currentStatus !== 'approved') {
            if (donation.quantity < application.requestedUnits) {
                return res.status(400).json({
                    message: `Not enough units available. Only ${donation.quantity} units left.`,
                    success: false
                });
            }

            const newQuantity = donation.quantity - application.requestedUnits;
            let newAvailable = donation.availableUnits;
            if (newAvailable !== undefined) {
                newAvailable = donation.availableUnits - application.requestedUnits;
            }

            await Donation.findByIdAndUpdate(donation._id, {
                quantity: newQuantity,
                availableUnits: newAvailable,
                status: (newQuantity <= 0 || newAvailable <= 0) ? 'expired' : donation.status
            });
        }
        
        else if (incomingStatus === 'declined' && currentStatus === 'approved') {
            const newQuantity = donation.quantity + application.requestedUnits;
            let newAvailable = donation.availableUnits;
            if (newAvailable !== undefined) {
                newAvailable = donation.availableUnits + application.requestedUnits;
            }

            let newStatus = donation.status;
            
            if (newQuantity > 0 && new Date(donation.expiryAt).getTime() > Date.now()) {
                newStatus = 'active';
            }

            await Donation.findByIdAndUpdate(donation._id, {
                quantity: newQuantity,
                availableUnits: newAvailable,
                status: newStatus
            });
        }

        application.status = incomingStatus;
        await application.save();

        return res.status(200).json({ message: "Application status updated successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


