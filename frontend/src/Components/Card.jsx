import { useContext } from "react";
import { userDataContext } from "../Context/UserContext";

export default function Card({ image }) {
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
  return (
    <div
      className={`w-32 sm:w-40 h-48 sm:h-64 bg-gradient-to-br from-blue-950 to-blue-900 border-2 rounded-2xl hover:shadow-2xl hover:shadow-blue-400 hover:border-blue-300 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        selectedImage == image
          ? "scale-105 border-2 border-blue-300 shadow-2xl shadow-blue-400"
          : "null"
      }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img
        src={image}
        alt="Card image"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  );
}
