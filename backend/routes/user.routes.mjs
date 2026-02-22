import express from "express";
import { getCurrentUser, talkToAssistant, updateAssistant } from "../controllers/user.controller.mjs";
import isAuth from "../middlewares/isAuth.mjs";
import upload from "../middlewares/multer.mjs";

const userRouter = express.Router();

userRouter.get("/current", isAuth,  getCurrentUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"),  updateAssistant);
userRouter.post("/talktoassistant", isAuth, talkToAssistant);
export default userRouter;