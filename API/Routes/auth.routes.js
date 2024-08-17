import express from "express";
import { signUp , logIn } from "../Controllers/auth.controllers.js";
const Router = express.Router();

Router.post('/signUp' , signUp);
Router.post('/logIn' , logIn);

export default Router;