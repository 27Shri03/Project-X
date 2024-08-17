// We can use Map also rather than a normal array for faster retrival.
import { io } from "../server.js";
import logger from "../config/winston.config.js";
import { EVENTS } from "../constants/contants.js";

const connectedSockets = new Map();

const handleNewConnection = (socket) => {
    try {
        const userId = socket.handshake.query.userId;
        const username = socket.handshake.query.username;
        connectedSockets.set(userId, {
            socketId: socket.id,
            username: username
        });
        logger.info(`${username} joined the socket!`);
        socket.emit("success", { message: `${username} is connected to sockets` });
    } catch (error) {
        socket.emit("error", { error: error.message });
        logger.error(error.message);
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