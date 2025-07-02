import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyFriends, getStreamToken, createGroupChannel } from "../lib/api";
import FriendCard from "../components/FriendCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import { Users } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const FriendsPage = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [chatClient, setChatClient] = useState(null);
  const [groupChannels, setGroupChannels] = useState([]);

  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  });

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();

    if (!trimmedName || selectedIds.length < 2) {
      return toast.error("Enter a group name and select at least 2 friends.");
    }

    try {
      const group = await createGroupChannel({
        name: trimmedName,
        memberIds: selectedIds,
        image: groupImage || undefined,
      });

      toast.success("Group created!");
      navigate(`/group/${group.channel}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Group creation failed");
    }
  };

  // Initialize Stream client
  useEffect(() => {
    const initStream = async () => {
      if (!authUser) return;

      try {
        const tokenData = await getStreamToken();
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        setChatClient(client);
      } catch (err) {
        toast.error("Failed to initialize chat client");
      }
    };

    initStream();
  }, [authUser]);

  // Fetch group channels
  useEffect(() => {
    const fetchChannels = async () => {
      if (!authUser || !chatClient) return;

      try {
        const channels = await chatClient.queryChannels(
          {
            type: "messaging",
            members: { $in: [authUser._id] },
          },
          { last_message_at: -1 },
          { watch: true, state: true }
        );

        setGroupChannels(channels);
      } catch (err) {
        console.error("Error fetching channels:", err);
        toast.error("Could not load group chats");
      }
    };

    fetchChannels();
  }, [chatClient, authUser]);

  if (isLoading) return <p>Loading friends...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Friends for Group</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className={`border rounded p-4 cursor-pointer ${
              selectedIds.includes(friend._id)
                ? "border-primary"
                : "border-base-300"
            }`}
            onClick={() => handleToggleSelect(friend._id)}
          >
            <FriendCard friend={friend} />
            <div className="text-sm text-center mt-2">
              {selectedIds.includes(friend._id) ? "Selected" : "Click to Select"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        
        <button className="btn btn-primary w-full" onClick={handleCreateGroup}>
          Create Group Chat
        </button>
      </div>

      {/* Group Chat List */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Your Group Chats</h2>
        {groupChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupChannels
  .filter(group => Object.keys(group.state?.members || {}).length >= 3)
  .map((group) => (
              <div
                key={group.id}
                className="border p-4 rounded cursor-pointer hover:shadow"
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <div className="flex items-center gap-3">
  {group.data.image ? (
    <img
      src={group.data.image}
      alt={group.data.name || "Group"}
      className="h-12 w-12 rounded-full object-cover"
    />
  ) : (
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-700 text-white">
      <Users className="w-6 h-6" />
    </div>
  )}
  <div>
    <h3 className="font-semibold">
      {group.data.name || "Unnamed Group"}
    </h3>
    <p className="text-sm text-gray-500">
      {Object.keys(group.state?.members || {}).length} members
    </p>
  </div>
</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You’re not part of any group chats yet.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;