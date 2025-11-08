import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
}



export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// user.controller.js
export const updateProfile = async (req, res) => {
    try {
        console.log("File received by controller:", req.file);
        const { fullname, email, phoneNumber, about, address } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (about) updateData['profile.about'] = about;
        if (address) updateData['profile.address'] = address;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use.", success: false });
            }
            updateData.email = email;
        }

        // 4. File upload handle karo (YAHAN FIX KIYA HAI)
        if (req.file) { // <--- FIX: req.file.path ko req.file kiya
            const fileUri = getDataUri(req.file); // <--- FIX: req.file.path ko req.file kiya
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData['profile.license'] = cloudResponse.secure_url;
            updateData['profile.licenseOriginalName'] = req.file.originalname;
        }

        // 5. Database mein update karo
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

        // 6. Naya user object waapas bhejo
        const userResponse = {
            _id: updatedUser._id,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            role: updatedUser.role,
            profile: updatedUser.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: userResponse,
            success: true,
        });

    } catch (error) {
        console.log("ERROR in updateProfile:", error);
        res.status(500).json({
            message: "Something went wrong!",
            success: false,
        });
    }
};