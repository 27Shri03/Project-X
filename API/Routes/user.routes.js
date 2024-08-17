import express from "express";
import { getFriends } from "../Controllers/user.controllers.js";
import { authMiddleware } from "../Middlewares/jwt.middleware.js";

const Router = express.Router();

Router.get("/friends", authMiddleware, getFriends);

export default Router;