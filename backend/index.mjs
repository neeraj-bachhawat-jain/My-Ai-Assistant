import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.mjs";
import authRouter from "./routes/auth.routes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.mjs";
import { geminiResponse } from "./gemini.mjs";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173"
      "https://my-ai-assistant-cm9g.onrender.com",
    ],
    credentials: true,
  })
);
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  connectDb();
  console.log("server started");
});
