import { asyncHandler } from "../utils/asyncHandler.js"
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js";
import { upsertStreamUser } from "../lib/stream.js";

// export async function signup(req, res) {
//     res.send("signup route")
// }




const signup = asyncHandler(async (req, res) => {
    const {email, password, fullName} = req.body;
        
        if(!email || !password || !fullName){
            throw new ApiError(400, "All fields are required");
        }

        if(password.length < 6){
            throw new ApiError(400, "Password must be atleast 6 charectors long");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }

        const existingUser = await User.findOne({ email });

        if(existingUser){
            throw new ApiError(400, "Email already exists");
        }

        //const idx = Math.floor(Math.random() * 100) + 1; 
        const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            });
            console.log(`User created in stream:${newUser.fullName} `);
            
        } catch (error) {
            console.log("Error creating stream user", error);
            throw new ApiError(500, "Failed to create user in Stream");
            
        }

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent xss attacks
            sameSite: "strict", //prevent csrf attacks
            secure: process.env.NODE_ENV === "production"

        })

        return res.status(201).json(new ApiResponse(201, newUser, "User registration complete"))
})





const login = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;

    if(!email || !password){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({email});

    if (!user){
        throw new ApiError(401, "Invalid email")
    }

    const isPasswordCorrect = await user.matchPassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid email or password")
    }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent xss attacks
            sameSite: "strict", //prevent csrf attacks
            secure: process.env.NODE_ENV === "production"

        });
        
        res.status(200).json(new ApiResponse(200, user, "User registration complete"))
    
})





const logout = asyncHandler(async (req, res) => {
    res.clearCookie("jwt")
    res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
})




const onboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    const missingFields = [];
    if (!fullName) missingFields.push("fullName");
    if (!bio) missingFields.push("bio");
    if (!nativeLanguage) missingFields.push("nativeLanguage");
    if (!learningLanguage) missingFields.push("learningLanguage");
    if (!location) missingFields.push("location");

    if (missingFields.length > 0) {
        throw new ApiError(400, "All fields are required", missingFields);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            isOnboarded: true
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }


    try {
        await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || ""
        })
        console.log(`User updated in stream:${updatedUser.fullName} `);
        
    } catch (streamError) {
        console.log("Error updating Stream user during onboarding", streamError.message);
        
        
    }

    res.status(200).json(new ApiResponse(200, updatedUser, "Success"));
});

export {
    signup,
    login,
    logout,
    onboard
}


