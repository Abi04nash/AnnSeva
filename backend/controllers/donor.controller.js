import { Donor } from "../models/donor.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register Donor
export const registerDonor = async (req, res) => {
    try {
        const { donorName, donorType } = req.body;
        if (!donorName || !donorType) {
            return res.status(400).json({
                message: "Donor name and donor type are required.",
                success: false
            });
        }

        let donor = await Donor.findOne({ name: donorName });
        if (donor) {
            return res.status(400).json({
                message: "This donor is already registered.",
                success: false
            });
        }

        donor = await Donor.create({
            name: donorName,
            donorType,
            userId: req.id
        });


        return res.status(201).json({
            message: "Donor registered successfully.",
            donor,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Get all donors for a user
export const getDonors = async (req, res) => {
    try {
        const userId = req.id; // logged-in user id
        const donors = await Donor.find({ userId });
        // if (!donors || donors.length === 0) {
        //     return res.status(404).json({
        //         message: "No donors found.",
        //         success: false
        //     });
        // }

        return res.status(200).json({
            donors,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Get donor by ID
export const getDonorById = async (req, res) => {
    try {
        const donorId = req.params.id;
        const donor = await Donor.findById(donorId);

        if (!donor) {
            return res.status(404).json({
                message: "Donor not found.",
                success: false
            });
        }

        return res.status(200).json({
            donor,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Update donor info
export const updateDonor = async (req, res) => {
    try {
        const { name, description, website, location, donorType } = req.body;
        const file = req.file;

        let logo;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location, donorType };
        if (logo) updateData.logo = logo;

        const donor = await Donor.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!donor) {
            return res.status(404).json({
                message: "Donor not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Donor information updated successfully.",
            donor,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
