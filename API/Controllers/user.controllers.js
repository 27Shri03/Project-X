import { User } from "../../Models/user.model.js";

export const getFriends = async (req, res) => {
    try {
        const userId = req.user.userId;  // This comes from the decoded token in the middleware

        // Use the userId to fetch friends
        const user = await User.findById(userId).populate({
            path: 'friends',
            select: '_id username photo'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error('Error fetching friends:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};