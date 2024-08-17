import { User } from "../../Models/user.model.js";
import { emitToUser } from "../../Socket/socketHandler.js";
import { EVENTS } from "../../constants/contants.js";

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
        if (receiverUser.friendRequests.includes(userId)) { // if you already have send the friendRequest
            return res.status(404).json({ message: `You already have send request to this ${username} ` });
        }
        if (receiverUser.friends.includes(userId)) { // if user is already your friend
            return res.status(404).json({ message: `${username} is already your friend` });
        }
        receiverUser.friendRequests.push({ user: userId });
        await receiverUser.save();
        const payload = {
            user: {
                username: req.user.username,
                photo: null
            },
            createdAt: receiverUser.updatedAt
        }
        emitToUser(receiverUser._id.toString(), EVENTS.RECEIVEFRIENDREQUEST, payload);

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
        otherUser.friends.push(myinfo._id);
        myinfo.friends.push(otherUser._id);

        // filtering the friendRequests as is is now accepted
        currentUser.friendRequests = currentUser.friendRequests.filter(
            request => request.user.username !== username
        );
        await Promise.all([currentUser.save(), friendUser.save()]);
        return res.status(200).json({ message: "Friend Request accepted Successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}