import express from "express";
const Router = express.Router();
import { getMessages , sendFriendRequest , acceptFriendRequest } from "../Controllers/chat.controllers.js";
import { authMiddleware } from "../Middlewares/jwt.middleware.js";

Router.get('/getMessages', authMiddleware, getMessages);
Router.post("/sendFriendRequest", authMiddleware, sendFriendRequest);
Router.post("/acceptFriendRequest", authMiddleware, acceptFriendRequest);

export default Router;