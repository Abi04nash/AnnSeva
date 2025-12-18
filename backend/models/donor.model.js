import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        unique : true
    },
    donorType:{
        type: String,
        enum: ["RESTAURANT", "HOTEL", "SHOP / STORE", "EVENT / CATERING", "BY_HOUSE"],
        required: true
    },
    description:{
        type : String, 
    },
    website:{
        type : String 
    },
    location:{
        type : String 
    },
    logo:{
        type : String           // URL se logo / Photo
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
},{timestamps:true}) 

export const Donor = mongoose.model("Donor", donorSchema);