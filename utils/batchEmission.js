import { connectedSockets } from "../Socket/socketHandler.js";
import { io } from "../server.js";

export const batchEmitToFriends = async (friends, event, data) => {
    const promises = friends.map(friend => {
        const friendSocket = connectedSockets.get(friend.user.toString());
        if (friendSocket) {
            return io.to(friendSocket.socketId).emit(event, data);
        }
        return null;
    }).filter(promise => promise !== null);
    await Promise.all(promises);
};
