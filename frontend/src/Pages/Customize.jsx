import { useContext, useRef, useState } from "react";
import Card from "../Components/Card";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import { userDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/Image1.jpeg";
import image2 from "../assets/Image2.jpeg";
import image3 from "../assets/Image3.jpeg";
import image4 from "../assets/Image4.jpeg";
import image5 from "../assets/Image5.jpeg";

export default function Customize() {
  const navigate = useNavigate();
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black via-[#0a0620] to-[#030342] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
        aria-label="Go back"
      >
        <IoArrowBackSharp className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      <div className="text-center mb-12 mt-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider mb-2">
          Select Your Assistant
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />

        <div
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
          className={`w-32 sm:w-40 h-48 sm:h-64 bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-blue-500/30 rounded-2xl hover:shadow-2xl hover:shadow-blue-400/50 hover:border-blue-300 cursor-pointer transition-all duration-300 transform hover:scale-105 flex justify-center items-center group ${
            selectedImage === "input"
              ? "scale-105 border-blue-300 shadow-2xl shadow-blue-400"
              : ""
          }`}
        >
          {!frontendImage ? (
            <RiImageAddFill className="text-white w-8 h-8 group-hover:scale-110 transition-transform" />
          ) : (
            <img
              src={frontendImage}
              className="w-full h-full object-cover rounded-2xl"
              alt="Selected"
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className="px-8 py-3 sm:py-4 font-semibold text-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
        >
          Next
        </button>
      )}
    </div>
  );
}
