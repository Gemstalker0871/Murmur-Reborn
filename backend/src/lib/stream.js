import {StreamChat} from "stream-chat"
import { ApiError } from "../utils/ApiError.js"
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if (!apiKey || !apiSecret){
    throw new ApiError( 500 ,"Stream api key or secret is missing")
}

export const streamClient = StreamChat.getInstance(apiKey, apiSecret);


export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData);
        return userData
    } catch (error) {
        throw new ApiError(500, "Stream user creation failed");
        
    }
}

export const generateStreamToken = (userId) => {
    try {
        //ensure userId is string
        const userIdstr = userId.toString()
        return streamClient.createToken(userIdstr)
    } catch (error) {
        throw new ApiError(500, "Failed to generate Stream token");
        
        
    }
}