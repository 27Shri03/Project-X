import { io } from "../server.js";
import logger from "../config/winston.config.js";
import { EVENTS } from "../constants/contants.js";
import { Conversation } from "../Models/conversation.model.js";

const connectedSockets = new Map();

const sendMessage = async (socket, payload) => {
    const { conversationId, message } = payload;
    const convo = await Conversation.findById(conversationId);
    if (!convo) {
        res.status(404).json({ message: `${conversationId} is not a valid Conversation ID` });
    }
    convo.messages.push(message);
    await convo.save();
    socket.to(conversationId).emit(EVENTS.RECEIVEMESSAGE, message);
}

const handleJoinRoom = async (socket, payload) => {
    try {
        const convo = await Conversation.findById(payload.conversationId);
        if (!convo) {
            socket.emit("error", { error: `${payload.conversationId} is not a valid Conversation ID` });
            logger.error("No conversation found while joining Room");
            return;
        }
        socket.join(payload.conversationId);
        socket.emit(EVENTS.SUCCESS, { message: `${payload.username} joined the room` });
        logger.info(`${payload.username} joined the room`)

    } catch (error) {
        socket.emit(EVENTS.ERROR, { error: error.message });
        logger.error("Error in JoinRoom : ", error.message);
    }
}

const handleNewConnection = (socket) => {
    try {
        const userId = socket.handshake.query.userId;
        const username = socket.handshake.query.username;
        connectedSockets.set(userId, {
            socketId: socket.id,
            username: username
        });
        logger.info(`${username} joined the socket!`);
        socket.emit(EVENTS.SUCCESS, { message: `${username} is connected to sockets` });
    } catch (error) {
        socket.emit(EVENTS.ERROR, { error: error.message });
        logger.error("Error in Socket Disconnection : ", error.message);
    }
};

const handleDisconnect = (socket) => {
    try {
        const socketTodelete = [...connectedSockets.entries()].find(([key, value]) => value.socketId === socket.id)?.[0];
        if (socketTodelete) {
            const userInfo = connectedSockets.get(socketTodelete);
            connectedSockets.delete(socketTodelete);
            logger.info(`${userInfo.username} disconnected`);
        }
    } catch (error) {
        logger.error(error.message);
    }

}
const emitToUser = (userId, event, payload) => {
    const userInfo = connectedSockets.get(userId);
    console.log(connectedSockets);
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
        socket.on("disconnect", () => handleDisconnect(socket));
    });
};
export { setupSocketHandlers, connectedSockets, emitToUser };