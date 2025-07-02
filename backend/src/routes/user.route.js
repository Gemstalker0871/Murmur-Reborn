import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs } from "../controllers/user.controller.js";

const router = express.Router();

//apply auth middleware to all routes

router.use(protectRoute)

router.route("/").get(getRecommendedUsers)

router.route("/friends").get(getMyFriends)


router.route("/friend-request/:id").post(protectRoute, sendFriendRequest)

router.route("/friend-request/:id/accept").put(protectRoute, acceptFriendRequest)

router.route("/friend-request").get(getFriendRequests)

router.route("/outgoing-friend-requests").get(getOutgoingFriendReqs)


export default router;