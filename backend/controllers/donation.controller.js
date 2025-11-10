import { Donation } from "../models/donation.model.js";

// post a new donation
export const postDonation = async (req, res) => {
  try {
    const {
      title,
      description,
      items,
      quantity,
      pickupLocation,
      donationType,
      freshnessLevel,
      availableUnits,
      donorId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !items ||
      !quantity ||
      !pickupLocation ||
      !donationType ||
      !freshnessLevel ||
      !availableUnits ||
      !donorId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const donation = await Donation.create({
      title,
      description,
      items: Array.isArray(items) ? items : items.split(",").map(i => i.trim()),
      quantity: Number(quantity),
      pickupLocation,
      donationType,
      freshnessLevel,
      availableUnits,
      donor: donorId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New donation posted successfully.",
      donation,
      success: true,
    });
  } catch (error) {
    console.log("Error posting donation:", error);
    return res.status(500).json({
      message: "Server error while posting donation.",
      success: false,
    });
  }
};

// NGO will view all donations
// In donation.controller.js

export const getAllDonations = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const donations = await Donation.find(query)
      .populate("donor")
      .populate("applications") // <--- ✅ ADD THIS LINE
      .sort({ createdAt: -1 });

    return res.status(200).json({
      donations,
      success: true,
    });
  } catch (error) {
    console.log("Error getting all donations:", error);
    return res.status(500).json({
      message: "Server error while fetching donations.",
      success: false,
    });
  }
};

// NGO will view donation by ID
export const getDonationById = async (req, res) => {
  try {
    const donationId = req.params.id;
    const donation = await Donation.findById(donationId).populate({
      path: "applications",
      populate: { path: "applicant", model: "User" },
    });

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found.",
        success: false,
      });
    }

    return res.status(200).json({
      donation,
      success: true,
    });
  } catch (error) {
    console.log("Error fetching donation by ID:", error);
    return res.status(500).json({
      message: "Server error while fetching donation by ID.",
      success: false,
    });
  }
};

// Donor can view all donations they created
export const getDonorDonations = async (req, res) => {
  try {
    const donorId = req.id;
    const donations = await Donation.find({ created_by: donorId })
      .populate("donor")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      donations,
      success: true,
    });
  } catch (error) {
    console.log("Error fetching donor donations:", error);
    return res.status(500).json({
      message: "Server error while fetching donor donations.",
      success: false,
    });
  }
};

// Update Donation

// export const updateDonation = async (req, res) => {
//   try {
//     const donationId = req.params.id;
//     const { title, description, items, quantity, pickupLocation, donationType, freshnessLevel, availableUnits } = req.body;

//     const updateData = {};
//     if (title) updateData.title = title;
//     if (description) updateData.description = description;
//     if (items) updateData.items = Array.isArray(items) ? items : items.split(",").map(i => i.trim());
//     if (quantity) updateData.quantity = Number(quantity);
//     if (pickupLocation) updateData.pickupLocation = pickupLocation;
//     if (donationType) updateData.donationType = donationType;
//     if (freshnessLevel) updateData.freshnessLevel = freshnessLevel;
//     if (availableUnits) updateData.availableUnits = Number(availableUnits);

//     const updatedDonation = await Donation.findByIdAndUpdate(
//       donationId,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedDonation) {
//       return res.status(404).json({ message: "Donation not found.", success: false });
//     }

//     return res.status(200).json({
//       message: "Donation updated successfully.",
//       donation: updatedDonation,
//       success: true
//     });
//   } catch (error) {
//     console.log("Error updating donation:", error);
//     return res.status(500).json({
//       message: "Server error while updating donation.",
//       success: false
//     });
//   }
// };




export const updateDonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { 
      title, 
      description, 
      items, 
      quantity, 
      pickupLocation, 
      donationType, 
      freshnessLevel, 
      availableUnits,
      donorId  // Ise add kiya
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (items) updateData.items = Array.isArray(items) ? items : items.split(",").map(i => i.trim());
    if (quantity) updateData.quantity = Number(quantity);
    if (pickupLocation) updateData.pickupLocation = pickupLocation;
    if (donationType) updateData.donationType = donationType;
    if (freshnessLevel) updateData.freshnessLevel = freshnessLevel;
    if (availableUnits) updateData.availableUnits = Number(availableUnits);
    if (donorId) updateData.donor = donorId; 

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      updateData,
      { new: true, runValidators: true }
    ).populate("donor"); 

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found.", success: false });
    }

    return res.status(200).json({
      message: "Donation updated successfully.",
      donation: updatedDonation,
      success: true
    });
  } catch (error) {
    console.log("Error updating donation:", error);
    return res.status(500).json({
      message: "Server error while updating donation.",
      success: false
    });
  }
};



