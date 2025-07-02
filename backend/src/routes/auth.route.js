import express from "express"
import { signup, login, logout, onboard } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const router = express.Router()

router.route("/signup").post(signup)

router.route("/login").post(login) 
//router.post("/login", login)	

router.route("/logout").post(protectRoute, logout) 

router.route("/onboarding").post( protectRoute, onboard)


//checks if user loggedin or not
router.route("/me").get(protectRoute, (req, res)=> {
    res.status(200).json(new ApiResponse(200, {user:req.user}))
});

export default router
