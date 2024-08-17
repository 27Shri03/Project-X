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
        receiverUser.friendRequests.push(userId);
        await receiverUser.save();
        const payload = {
            timestamp : receiverUser.updatedAt,
            username : req.user.username,
        }
        emitToUser(receiverUser._id , EVENTS.RECEIVEFRIENDREQUEST , payload);        

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}

export const acceptFriendRequest = async(req,res) =>{
    
}