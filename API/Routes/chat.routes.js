import express from "express";
const Router = express.Router();
import { getMessages } from "../Controllers/chat.controllers.js";
import { authMiddleware } from "../Middlewares/jwt.middleware.js";

Router.get('/getMessages', authMiddleware, getMessages);

export default Router;