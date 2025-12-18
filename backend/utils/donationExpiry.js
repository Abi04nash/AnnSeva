import { Donation } from "../models/donation.model.js";
import { Application } from "../models/application.model.js";

export const handleDonationExpiry = async () => {
  const now = new Date();

  // ⏰ TIME BASED EXPIRY
  await Donation.updateMany(
    {
      status: "active",
      expiryAt: { $lt: now }
    },
    { status: "expired" }
  );

  // 📦 QUANTITY BASED EXPIRY
  const donations = await Donation.find({ status: "active" })
    .populate("applications");

  for (let d of donations) {
    if (d.applications.length >= d.quantity) {
      d.status = "expired";
      await d.save();
    }
  }
};
