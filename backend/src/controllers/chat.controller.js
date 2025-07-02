import { generateStreamToken } from "../lib/stream.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { streamClient } from "../lib/stream.js";



const getStreamToken = asyncHandler(async (req, res) => {
  const token = generateStreamToken(req.user.id);
  res.status(200).json(new ApiResponse(200, { token }));
});



// Create group chat channelAdd commentMore actions
const createGroupChannel = asyncHandler(async (req, res) => {
  const { name, memberIds, image } = req.body;

  if (!name || !Array.isArray(memberIds) || memberIds.length < 2) {
    return res.status(400).json(
      new ApiError(400, "Name and at least 2 member IDs are required for a group chat")
    );
  }

  const channelId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(); // ✅ ensures uniqueness

  const channel = streamClient.channel("messaging", channelId, {
    name,
    members: [req.user.id, ...memberIds],
    image,
    created_by_id: req.user.id,
  });

  await channel.create(); // ✅ ensures the channel is persistent and visible to all members

  console.log("✅ Group chat created:", channel.id);

  res.status(201).json(
    new ApiResponse(201, { channel: channel.id }, "Group chat created")
  );
});

export {
    getStreamToken,
  createGroupChannel,
};