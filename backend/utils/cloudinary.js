import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

//For debugging
// console.log("--- DEBUGGING CLOUDINARY KEYS ---");
// console.log("Cloud Name (process.env.CLOUD_NAME):", process.env.CLOUD_NAME);
// console.log("API Key (process.env.API_KEY):", process.env.API_KEY);
// console.log("API Secret (Loaded?):", process.env.API_SECRET ? "Yes, Loaded" : "No, UNDEFINED");
// console.log("---------------------------------");


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});
export default cloudinary;