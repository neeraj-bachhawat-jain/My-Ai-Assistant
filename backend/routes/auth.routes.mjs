import express from "express";
import { Login, Logout, SignUp } from "../controllers/auth.controller.mjs";

const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login);
authRouter.get("/logout", Logout);

export default authRouter;
