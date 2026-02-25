import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiTextImage from "../assets/ai.webp";
import wave from "../assets/wave.gif";

export default function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // Modal state for history
  const [showHistory, setShowHistory] = useState(false);
  // Replace this with actual history data from backend or context
  // const [history, setHistory] = useState([
  //   { user: "What is the weather today?", ai: "The weather today is sunny with a high of 25°C." },
  //   { user: "Open calculator", ai: "Opening calculator." },
  //   { user: "Play music on YouTube", ai: "Searching YouTube for music." }
  // ]);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      setUserData(null);
      console.log(err);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (!error.message.includes("start")) {
          console.error("Recognition error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    if (!synth) {
      alert("Speech not supported in this browser");
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      speech.voice = hindiVoice;
    }
    isSpeakingRef.current = true;
    speech.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
      // startRecognition()
    };
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    synth.cancel();
    synth.speak(speech);
  };

  const handleCommand = (data) => {
    if (!data) {
      speak("Sorry, I didn't receive a response from the assistant.");
      return;
    }
    const { type, userInput, response } = data || {};
    if (response) {
      speak(response);
    } else {
      speak("Sorry, the assistant returned no response.");
    }
    // if (type === "generals") {
    //   console.log(response);
    // }
    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          // console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.log(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      // console.log("Recongnition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              // console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.log(e);
            }
          }
          // safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      // console.log(transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        let data = await getGeminiResponse(transcript);
        // console.log(data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };
    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can I help you with?`
    );
    greeting.lang = "hi-IN";
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  const deleteHistory = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/user/deleteHistory`,
        {},
        { withCredentials: true }
      );
      setUserData({ ...userData, history: [] });
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black via-blue-900 to-purple-600 flex justify-center items-center flex-col backdrop-blur-3xl p-4 sm:p-6">
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000c2]">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6 relative animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
              History
            </h2>
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-200">
              {userData.history.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No history yet.
                </div>
              ) : (
                userData.history?.map((item, idx) => (
                  <div key={idx} className="py-3">
                    <div className="font-semibold text-gray-800">
                      <span className="font-normal">{item}</span>
                    </div>
                  </div>
                ))
              )}
              <button
                className="w-full py-2 bg-red-500 text-white rounded-lg mt-4 hover:bg-red-600 transition-colors hover:cursor-pointer"
                onClick={deleteHistory}
              >
                Delete History
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none hover:cursor-pointer"
              onClick={() => setShowHistory(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 flex justify-center items-center overflow-hidden rounded-3xl sm:rounded-4xl shadow-2xl border-2 border-pink-500 border-opacity-30">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full w-full object-cover rounded-3xl sm:rounded-4xl"
        />
      </div>
      <h1 className="text-white p-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mt-6 sm:mt-8 drop-shadow-lg">
        I'm{" "}
        <span className="text-pink-400 animate-pulse">
          {userData?.assistantName}
        </span>
      </h1>
      <div className="mt-4 sm:mt-6 h-20 sm:h-28 flex justify-center items-center">
        {!aiText && (
          <img
            src={wave}
            className="w-48 sm:w-56 md:w-64 h-20 sm:h-28 object-contain"
          />
        )}
        {aiText && (
          <img
            src={aiTextImage}
            className="w-48 sm:w-56 md:w-64 h-20 sm:h-28 object-contain"
          />
        )}
      </div>
      <h1 className="text-white text-center text-sm sm:text-base md:text-lg px-4 mt-4 min-h-8 text-opacity-90 drop-shadow-md">
        {userText ? userText : aiText ? aiText : null}
      </h1>
      <div className="flex flex-col gap-3 sm:gap-4 absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex-wrap justify-end">
        <button
          className="px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-full text-xs sm:text-sm md:text-lg hover:border-2 hover:border-yellow-300 transition-all duration-300 cursor-pointer bg-yellow-500 bg-opacity-30 hover:bg-opacity-50 shadow-lg hover:shadow-yellow-500/50"
          onClick={() => setShowHistory(true)}
        >
          History
        </button>
        <div className="flex gap-2">
          <button
            className="px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-full text-xs sm:text-sm md:text-base hover:border-2 hover:border-blue-300 transition-all duration-300 cursor-pointer bg-blue-500 bg-opacity-30 hover:bg-opacity-50 shadow-lg hover:shadow-blue-500/50"
            onClick={() => navigate("/customize")}
          >
            Customize
          </button>
          <button
            className="px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded-full text-xs sm:text-sm md:text-base hover:border-2 hover:border-red-300 transition-all duration-300 cursor-pointer bg-red-500 bg-opacity-30 hover:bg-opacity-50 shadow-lg hover:shadow-red-500/50"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
