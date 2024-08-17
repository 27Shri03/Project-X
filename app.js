import express from "express";
import cors from "cors";
import connectDB from "./config/databaseConnection.js";
import setupSwagger from "./swaggerConfig.js";
import dotenv from "dotenv";
import authRoutes from "./API/Routes/auth.routes.js";
import userRoutes from "./API/Routes/user.routes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Setup Swagger
setupSwagger(app);

// Routes
// app.use("/api/user", userRoute);
export default app;