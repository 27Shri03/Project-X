import express from "express";
import cors from "cors";
import connectDB from "./config/databaseConnection.js";
import setupSwagger from "./swaggerConfig.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup Swagger
setupSwagger(app);

// Routes
// app.use("/api/user", userRoute);
export default app;