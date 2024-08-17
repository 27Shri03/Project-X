// We can use Map also rather than a normal array for faster retrival.
import { io } from "../server.js";
import logger from "../config/winston.config.js";
const connectedSockets = new Map();

const handleNewConnection = (socket) => {
    const userId = socket.handshake.query.userId;
    const username = socket.handshake.query.username;
    connectedUsers.set(userId, {
        socketId: socket.id,
        username: username
    });
    logger.info(`${username} joined the socket!`);
};

const handleDisconnect = (socket) => {
    const socketTodelete = [...connectedSockets.entries()].find(([key, value]) => value.socketId === socket.id)?.[0];
    if (socketTodelete) {
        const userInfo = connectedSockets.get(socketTodelete);
        connectedSockets.delete(socketTodelete);
        logger.info(`${userInfo.username} disconnected`);
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
        socket.on("disconnect", () => handleDisconnect(socket));
    });
};
export { setupSocketHandlers, connectedSockets, emitToUser };