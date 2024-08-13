
let connectedSockets = [];

const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        handleNewConnection(socket, io);
        socket.on("disconnect", () => handleDisconnect(socket, io));
    });
};

const handleNewConnection = (socket, io) => {
    const Userid = socket.handshake.auth.userid;
    const username = socket.handshake.auth.name;
    const service = socket.handshake.auth.service;
    console.log(service);
    if (!connectedSockets.find((soc) => soc.Userid === Userid)) {
        console.log("A user connected", username);
        connectedSockets.push({
            socketId: socket.id,
            Userid,
            username,
            service
        });
    }
};

const handleDisconnect = (socket, io) => {

}

export { setupSocketHandlers, connectedSockets };