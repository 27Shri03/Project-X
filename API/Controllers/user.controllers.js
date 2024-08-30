import { User } from "../../Models/user.model.js";
import { Conversation } from "../../Models/conversation.model.js";
import { emitToUser } from "../../Socket/socketHandler.js";
import { EVENTS } from "../../constants/contants.js";
import { uploadFile } from "../../utils/uploadFile.js";


export const sendFriendRequest = async (req, res) => {
    const { username } = req.body;
    const { userId } = req.user;
    try {
        if (!username) { // username not found
            return res.status(400).json({ message: "Username is required " })
        }
        const receiverUser = await User.findOne({ username: username });
        if (!receiverUser) { // receiver user is not registered
            return res.status(404).json({ message: `User with username : ${username} is not present in our database` });
        }
        if (receiverUser.friendRequests.some((request) => request.user.toString() === userId)) { // if you already have send the friendRequest
            return res.status(404).json({ message: `You already have send this request to ${username} ` });
        }
        if (receiverUser.friends.find((friend) => friend.user.toString() === userId)) { // if user is already your friend
            return res.status(404).json({ message: `${username} is already your friend` });
        }
        receiverUser.friendRequests.push({ user: userId });
        await receiverUser.save();
        const myinfo = await User.findById(userId);
        const payload = {
            user: {
                username: req.user.username,
                photo: myinfo.photo || null
            },
            createdAt: receiverUser.updatedAt
        }
        emitToUser(receiverUser._id.toString(), EVENTS.RECEIVEFRIENDREQUEST, payload);
        return res.status(200).json({ message: `Request sent to ${username} successfully` });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const acceptFriendRequest = async (req, res) => {
    const { username } = req.body;
    const { userId } = req.user;
    try {
        const myinfo = await User.findById(userId).populate('friendRequests.user', 'username');
        // if the user itself is not registered in db
        if (!myinfo) {
            return res.status(404).json({ message: `${req.user.username} not found in database` });
        }
        const friendRequest = myinfo.friendRequests.find((request) => request.user.username === username);
        // if the friendRequest is not present
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request is not valid" });
        }
        const otherUser = await User.findOne({ username: username });
        // if the friend is not registered in db
        if (!otherUser) {
            return res.status(404).json({ message: "Friend User not found" });
        }
        const conversation = new Conversation({
            participants: [myinfo._id, otherUser._id],
            messages: [],
        })
        await conversation.save();
        otherUser.friends.push({ user: myinfo._id, conversationId: conversation._id });
        myinfo.friends.push({ user: otherUser._id, conversationId: conversation._id });
        // filtering the friendRequests as is is now accepted
        myinfo.friendRequests = myinfo.friendRequests.filter(
            request => request.user.username !== username
        );
        await Promise.all([myinfo.save(), otherUser.save()]);
        const payload = {
            username: myinfo.username,
            photo: myinfo.photo,
            UID: myinfo._id,
            conversationId: conversation._id
        }
        emitToUser(otherUser._id.toString(), EVENTS.ACCEPTEDFRIENDREQUEST, payload);
        return res.status(200).json({ message: "Friend Request accepted Successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const uploadProfilePhoto = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!req.file) {
            return res.status(404).json({ message: "No file uploaded try again :(" });
        }
        const imageUrl = await uploadFile(req.file.path);
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.photo = imageUrl
        await user.save();
        res.status(200).json({
            message: "Profile photo uploaded successfully",
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const rejectFriendRequest = async (req, res) => {
    const { username } = req.body;
    const { userId } = req.user;
    try {
        if (!username) { // username not found
            return res.status(404).json({ message: "Username is required " })
        }
        const myinfo = await User.findById(userId).populate('friendRequests.user', 'username');
        if (!myinfo.friendRequests.find((friend) => friend.user.username === username)) {
            return res.status(404).json({ message: "Friend Request not found" })
        }
        myinfo.friendRequests = myinfo.friendRequests.filter(
            request => request.user.username !== username
        );
        myinfo.save();
        return res.json({ message: "Friend Request rejected successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}