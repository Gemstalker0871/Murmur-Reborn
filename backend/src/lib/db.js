import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1); // 1 means failure
        
    }
}

export {connectDB}