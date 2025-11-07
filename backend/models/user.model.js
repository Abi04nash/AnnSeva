import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    phoneNumber: {
        type : Number,
        required : true
    },
    password:{
        type : String,
        required : true,
    },
    role:{
        type : String,
        enum : ['ngo','donor'],   //Options ke liye enums
        required : true
    },
    profile:{
        about : {type:String},
        address : {type:String},
        license : {type:String},      // URL se file for the validation
        licenseOriginalName : {type:String},
        donor : {type:mongoose.Schema.Types.ObjectId, ref:'Donor'}, 
        profilePhoto : {
            type : String,
            default : ""
        }
    },
},{timestamps:true});

export const User = mongoose.model('User', userSchema);