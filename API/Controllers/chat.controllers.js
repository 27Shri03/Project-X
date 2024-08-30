import { Conversation } from "../../Models/conversation.model.js";


export const getMessages = async (req, res) => {
    try {
        const { limit = 20, page = 1, conversationId } = req.query;
        let conversation = await Conversation.findById(conversationId);
        console.log(conversationId);
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found please make the User friend first" });
        }
        const totalMessages = conversation.messages.length;
        const messages = conversation.messages
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice((page - 1) * limit, page * limit);

        const hasMore = totalMessages > page * limit;

        res.status(200).json({
            messages,
            totalMessages,
            hasMore,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};