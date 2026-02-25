import React, { useContext, useState } from "react";
import { userDataContext } from "../Context/UserContext";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      // console.log(result.data);
      setUserData(result.data);
      setLoading(false);
      setAssistantName("");
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gradient-to-t from-black to-[#030342] p-4">
      <button
        onClick={() => navigate("/customize")}
        className="absolute top-6 left-6 p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
        aria-label="Go back"
      >
        <IoArrowBackSharp className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
      <h1 className="text-white text-center text-2xl md:text-3xl font-bold p-6 uppercase">
        Enter your assistant name
      </h1>
      <input
        type="text"
        placeholder="eg: Yara"
        className="w-full max-w-md h-12 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full px-5 py-2 text-lg"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-[150px] h-16 mt-8 text-black font-semibold bg-white rounded-full text-lg hover:bg-gray-200 transition-colors cursor-pointer"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Submit" : "loading..."}
        </button>
      )}
    </div>
  );
}
