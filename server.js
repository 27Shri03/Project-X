import http from "http";
import 'dotenv/config';
import { Server } from "socket.io";
import app from "./app.js";
import { setupSocketHandlers } from "./Socket/socketHandler.js";


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust as necessary for your CORS policy
        methods: ["GET", "POST"],
    },
});

// Setup socket handlers
setupSocketHandlers(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the io instance if needed in other modules
export { io };