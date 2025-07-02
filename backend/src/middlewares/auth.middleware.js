import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;

        if (!token) {
                return next(new ApiError(401, "Unauthorized: No token provided"));
            }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json(new ApiResponse(401, {}, "User not found"))
        }

        req.user = user;
        next();
    
    
        
    } catch (error) {
        return next(new ApiError(500, "Internal server error"));
    }
}