import { Conversation } from "../../Models/conversation.model.js";

export const getMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 20, page = 1, friendId } = req.query;

        let conversation = await Conversation.findOne({
            participants: { $all: [userId, friendId], $size: 2 }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, friendId],
                messages: [],
            })
            await conversation.save();
        }
        const totalMessages = conversation.messages.length;
        const messages = conversation.messages
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice((page - 1) * limit, page * limit);

        const hasMore = totalMessages > page * limit;

        res.status(200).json({
            messages,
            page,
            limit,
            totalMessages,
            hasMore,
            conversationId: conversation._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};