import express from "express";
import { authMiddleware } from "../Middlewares/jwt.middleware.js";
import { sendFriendRequest, acceptFriendRequest } from "../Controllers/user.controllers.js";

const Router = express.Router();

Router.post("/sendFriendRequest", authMiddleware, sendFriendRequest);
Router.post("/acceptFriendRequest", authMiddleware, acceptFriendRequest);

export default Router;