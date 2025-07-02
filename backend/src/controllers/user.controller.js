import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import FriendRequest from "../models/friendRequest.model.js";



const getRecommendedUsers = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const currentUser = req.user

    const recommendedUsers = await User.find({
        $and: [
            {_id: {$ne: currentUserId}},  //exclude current user
            {_id: {$nin: currentUser.friends}}, //exclude friends
            {isOnboarded: true}
        ]
    })
    res.status(200).json(new ApiResponse(200, recommendedUsers, "Done"))
})







const getMyFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    .select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage")

    res.status(200).json(new ApiResponse(200, user.friends, "Done"))
})



const sendFriendRequest = asyncHandler(async (req, res) => {
    const myId = req.user.id
    const { id:recipientId } = req.params

    //prevent sending request to yourself

    if (myId === recipientId){
        throw new ApiError(400, "You can't send friend request to yourself");
    }

    const recipient = await User.findById(recipientId)

    if(!recipient){
        throw new ApiError(404, "Recipient not found")
    }

    //check if already friends
    if(recipient.friends.includes(myId)){
        throw new ApiError(400, "You are already friends with this user");
    }

    //check if requests exists
    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: myId, recipient:recipientId },
            {sender: recipientId ,recipient: myId}
        ]
    })

    if(existingRequest){
        return res
        .status(400)
        .json(new ApiResponse(400, "A friend request already exists between you and this user"))
    }

    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
    })

    res.status(201).json(new ApiResponse(201, friendRequest, "Success"))

})


const acceptFriendRequest = asyncHandler(async(req, res) => {
    const {id: requestId} = req.params
    
    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest){
        throw new ApiError(404, "Friend request not found")
    }

    //verify if the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id){
        throw new ApiError(403, "You are not authorized to accept this request")
    }


    friendRequest.status = "accepted"
    await friendRequest.save()

    //add each user to friend list of each other array
    await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: {friends: friendRequest.recipient},
    })

    await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: {friends: friendRequest.sender},
    })
//await FriendRequest.findByIdAndDelete(requestId);
    

    res.status(200).json(new ApiResponse(200, null, "Friend request accepted"));
})


const getFriendRequests = asyncHandler (async (req, res) => {
    const incomingReqs = await FriendRequest.find({
        recipient: req.user.id,
        status: "pending"
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
        sender: req.user.id,
        status: "accepted",
    }).populate("recipient", "fullName profilePic")

    res.status(200).json(new ApiResponse(200, { incomingReqs, acceptedReqs }, "Friend requests fetched"));

})

const getOutgoingFriendReqs = asyncHandler(async (req, res) => {
    const outgoingRequests = await FriendRequest.find({
        sender: req.user.id,
        status: "pending"
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(new ApiResponse(200, outgoingRequests))
})



export {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendReqs
}
