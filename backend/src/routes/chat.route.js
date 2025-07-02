import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getStreamToken, createGroupChannel  } from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/token").get(protectRoute, getStreamToken)

router.route("/group").post(protectRoute, createGroupChannel);

export default router