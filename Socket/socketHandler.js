import { io } from "../server.js";
import logger from "../config/winston.config.js";
import { EVENTS } from "../constants/contants.js";
import { Conversation } from "../Models/conversation.model.js";
import { User } from "../Models/user.model.js";
import { batchEmitToFriends } from "../utils/batchEmission.js";

const connectedSockets = new Map();

const handleIsTyping = (socket, payload) => {
    try {
        payload = JSON.parse(payload);
        socket.to(payload.conversationId).emit(EVENTS.FRIENDTYPING, payload.typing);

    } catch (error) {
        logger.error(`Error in handleisTyping : ${error.message}`);
        socket.emit(EVENTS.ERROR, { message: error.message });
    }
}

const sendMessage = async (socket, payload) => {
    try {
        // payload = JSON.parse(payload);
        payload = JSON.parse(payload);
        const { message, conversationId } = payload;
        if (!message || !conversationId) {
            socket.emit(EVENTS.ERROR, { message: "message and conversationId required in payload" });
            logger.error("message and conversationId required in payload");
            return;
        }
        let convo = await Conversation.findById(conversationId);
        if (!convo) {
            socket.emit(EVENTS.ERROR, { message: "No conversation found please make the user your friend in order to start conversation" });
            logger.warn("Wrong conversation Id in sendMessage");
            return;
        }
        convo.messages.push(message);
        await convo.save();
        socket.to(conversationId).emit(EVENTS.RECEIVEMESSAGE, message);
        socket.emit(EVENTS.SUCCESS, { message: `Message send to your ID : ${conversationId} successfully` });
        logger.info("Message Sent successfully");
    } catch (error) {
        socket.emit(EVENTS.ERROR, { message: error.message });
        logger.error(`Error in SendMessage : ${error.message}`);
    }
}

// Only for group Chat
const handleJoinRoom = async (socket, payload) => {
    try {
        payload = JSON.parse(payload);
        const { conversationId, username } = payload;
        console.log(conversationId);
        const convo = await Conversation.findById(conversationId);
        if (!convo) {
            socket.emit(EVENTS.ERROR, { message: `${conversationId} is not a valid Conversation ID` });
            logger.error("No conversation found while joining Room");
            return;
        }
        socket.join(conversationId);
        socket.emit(EVENTS.SUCCESS, { message: `${username} joined the room` });
        logger.info(`${username} joined the room`)

    } catch (error) {
        socket.emit(EVENTS.ERROR, { message: error.message });
        logger.error("Error in JoinRoom : ", error.message);
    }
}

const handleNewConnection = async (socket) => {
    try {
        const userId = socket.handshake.query.userId;
        const username = socket.handshake.query.username;
        connectedSockets.set(userId, {
            socketId: socket.id,
            username: username
        });
        const user = await User.findById(userId);
        batchEmitToFriends(user.friends, EVENTS.FRIENDSTATUS, { userId, username, online: true });
        logger.info(`${username} joined the socket!`);
        socket.emit(EVENTS.SUCCESS, { message: `${username} is connected to sockets` });
    } catch (error) {
        socket.emit(EVENTS.ERROR, { message: error.message });
        logger.error(`Error in Socket Connection : ${error.message}`);
    }
};

const handleDisconnect = async (socket) => {
    try {
        const socketTodelete = [...connectedSockets.entries()].find(([key, value]) => value.socketId === socket.id)?.[0];

        if (socketTodelete) {
            const userInfo = connectedSockets.get(socketTodelete);
            const user = await User.findById(socketTodelete);
            batchEmitToFriends(user.friends, EVENTS.FRIENDSTATUS, { userId: socketTodelete, username: userInfo.username, online: false });
            connectedSockets.delete(socketTodelete);
            logger.info(`${userInfo.username} disconnected`);
        }
    } catch (error) {
        logger.error(error.message);
    }

}
const emitToUser = (userId, event, payload) => {
    const userInfo = connectedSockets.get(userId);
    if (userInfo) {
        io.to(userInfo.socketId).emit(event, payload);
        logger.info(`${event} sent successfully to ${userInfo.username}`);
    }
    else {
        logger.warn(`${userId} not found for event ${event}`);
    }
};

const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        handleNewConnection(socket, io);
        socket.on("sendMessage", (payload) => sendMessage(socket, payload));
        socket.on("joinRoom", (payload) => handleJoinRoom(socket, payload));
        socket.on("userTyping", (payload) => handleIsTyping(socket, payload));
        socket.on("disconnect", () => handleDisconnect(socket));
    });
};

export { setupSocketHandlers, connectedSockets, emitToUser };