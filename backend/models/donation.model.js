import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    items: [{
        type: String    
    }],
    quantity: {
        type: Number,   
        required: true
    },
    freshnessLevel: {
        type: Number,   
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    donationType: {
        type: String, 
        required: true
    },
    availableUnits: {
        type: Number,   
        required: true
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

export const Donation = mongoose.model("Donation", donationSchema);
