import axios from "axios";
import { GoogleGenAI } from "@google/genai";

export const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const prompt = `
      You are a smart, friendly, voice-enabled virtual assistant named ${assistantName}, created by ${userName}.

      You speak naturally like a real assistant (similar to Alexa or Google Assistant), 
      but you are NOT Google. Keep responses short, conversational, and voice-friendly.

      Your job:
        Understand the user's natural language command and respond ONLY with a valid JSON object in this format:

      {
        "type": "<intent_type>",
        "userInput": "<cleaned user input>",
        "response": "<short spoken response>"
      }

      ========================
        AVAILABLE INTENTS
      ========================

      General:
        - generals
        - youtube_search
        - youtube_play

      Apps:
        - calculator_open
        - instagram_open
        - facebook_open
        - whatsapp_open
        - gmail_open
        - spotify_play

      System:
        - weather_show
        - get_time
        - get_date
        - get_day
        - get_month
        - open_camera
        - open_settings
        - increase_volume
        - decrease_volume

        ========================
          INTENT RULES
        ========================

        1. Remove assistant name from user input if mentioned.
        2. For search intents, keep ONLY the search query in "userInput".
        3. Keep "response" short (1 sentence).
        4. Sound natural and friendly.
        5. Never explain what you're doing internally.
        6. If user asks who created you, respond with ${userName}.
        7. If command is unclear, set type = "general" and politely ask for clarification.

        ========================
          RESPONSE STYLE EXAMPLES
        ========================

        Instead of robotic:
          "Opening Instagram application."
        Use:
          "Sure, opening Instagram."
          "Playing it now."
          "Here’s what I found."
          "It’s currently 4:30 PM."
          "Today is Monday."

        Keep tone:
          - Friendly
          - Confident
          - Short
          - Natural for voice output

        ========================
          IMPORTANT
        ========================

        Return ONLY the JSON object.
        Do NOT add extra text.
        Do NOT wrap in markdown.
        Do NOT explain anything.

        Now process this user input: ${command}
      `;
    const ai = new GoogleGenAI({ apiKey: apiUrl });

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const responseText = result.candidates[0].content.parts[0].text.trim();
    // console.log("Gemini Response:", responseText);

    try {
      return JSON.parse(responseText);
    } catch (parseErr) {
      console.log("JSON Parse Error:", parseErr.message);
      // Try to extract JSON from the response if it's wrapped in markdown or extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Gemini response is not valid JSON: " + responseText);
    }
  } catch (err) {
    console.log("Gemini API Error:", err.message);
    throw new Error("Failed to get response from Gemini API");
  }
};
