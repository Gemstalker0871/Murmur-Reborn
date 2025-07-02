import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import cors from 'cors'


dotenv.config({path: './.env'});

const app = express();
const PORT = process.env.PORT

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //allow front end to send cookies
}))

app.use(express.json())

app.use(cookieParser());

app.use("/api/auth", authRoutes)

app.use("/api/users", userRoutes)

app.use("/avatars", express.static("public/avatars"));

app.use("/api/chat", chatRoutes)



connectDB()
.then(() => {
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
    
    })
})
.catch((error) => {
    console.log("MONGO DB CONNECT FAILED!!!", error);
    
})

app.use((err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});