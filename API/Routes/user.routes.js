import express from "express";
import { authMiddleware } from "../Middlewares/jwt.middleware.js";
import { sendFriendRequest, acceptFriendRequest, uploadProfilePhoto, rejectFriendRequest } from "../Controllers/user.controllers.js";
import { upload } from "../Middlewares/multer.middleware.js";


const Router = express.Router();

Router.post("/sendFriendRequest", authMiddleware, sendFriendRequest);
Router.post("/rejectFriendRequest", authMiddleware, rejectFriendRequest);
Router.post("/acceptFriendRequest", authMiddleware, acceptFriendRequest);
Router.post('/uploadProfilePhoto', authMiddleware, upload.single('image'), uploadProfilePhoto)

export default Router;