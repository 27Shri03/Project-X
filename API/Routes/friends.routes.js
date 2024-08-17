import express from "express";
import { sendFriendRequest , acceptFriendRequest } from "../Controllers/friends.controllers.js";
import { authMiddleware } from "../Middlewares/jwt.middleware.js";

const Router = express.Router();

Router.post("/sendFriendRequest", authMiddleware, sendFriendRequest);
Router.update("/acceptFriendRequest", authMiddleware, acceptFriendRequest);

export default Router;