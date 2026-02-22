import User from "../models/userModel.mjs";
import uploadOnCloudinary from "../config/cloudinary.js";
import { geminiResponse } from "../gemini.mjs";
import { response } from "express";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).send({ message: "user not found" });
    }
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "get current user error: " });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: "update asssistant error: " });
  }
};

export const talkToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ response: "Command is required" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }
    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);

    const gemResult = result;
    const type = gemResult.type;
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Month is ${moment().format("MMMM")}`,
        });
        case  'general':
          return res.json({
            type,
            userInput: gemResult.userInput,
            response: gemResult.response,
        });
        case  'google_search':
        case  'youtube_search':
        case  'youtube_play':
        case  'calculator_open':
        case  'instagram_open':
        case  'facebook_open':
        case  'whatsapp_open':
        case  'gmail_open':
        case  'spotify_play':
        case  'weather_show': 
        return res.json({
            type,
            userInput: gemResult.userInput,
            response: gemResult.response,
        });
        default:
            return res.status(400).json({response: "I didn't understand that command."})    
    }
  } catch (error) {
    console.log("Talk to Assistant Error:", error.message);
    return res.status(500).json({response: "Error communicating with assistant. Please try again."})
  }
};
