import express from "express";
import cors from "cors";
import connectDB from "./config/databaseConnection.config.js";
import setupSwagger from "./config/swagger.config.js";
import dotenv from "dotenv";
import authRoutes from "./API/Routes/auth.routes.js";
import chatRoutes from "./API/Routes/chat.routes.js";
import userRoutes from "./API/Routes/user.routes.js";
import morganMiddleware from "./API/Middlewares/morgan.middleware.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Setup Swagger
setupSwagger(app);

// Routes
// app.use("/api/user", userRoute);
export default app;