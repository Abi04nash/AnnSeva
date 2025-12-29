import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    donation: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation', 
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    requestedItems: [
        {
            type: String,
            required: true
        }
    ],

    requestedUnits: {
        type: Number,
        required: true,
        min: 1
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);
