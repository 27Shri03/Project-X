import express from "express";
import cors from "cors";
import connectDB from "./config/databaseConnection.config.js";
import setupSwagger from "./config/swagger.config.js";
import authRoutes from "./API/Routes/auth.routes.js";
import chatRoutes from "./API/Routes/chat.routes.js";
import userRoutes from "./API/Routes/user.routes.js";
import morganMiddleware from "./API/Middlewares/morgan.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

//Routes
app.get('/', (req, res) => {
    // const swaggerLink = `http://localhost:${process.env.WEBSITES_PORT || 8080}/api-docs`;
    const swaggerLink = 'https://redchat.azurewebsites.net/api-docs';
    const socketDocsLink = 'https://github.com/27Shri03/Red-Chat/blob/main/Docs/socketDocs.md';


    // Read the HTML file
    let html = fs.readFileSync(path.join(__dirname, 'public', 'landingPage.html'), 'utf8');

    // Replace the placeholder with the actual Swagger link
    html = html.replace('API_DOCS_URL', swaggerLink);
    html = html.replace('SOCKET_DOCS_URL', socketDocsLink);

    res.send(html);
});
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Setup Swagger
setupSwagger(app);

// Routes
// app.use("/api/user", userRoute);
export default app;