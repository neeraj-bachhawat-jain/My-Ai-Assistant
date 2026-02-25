import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (err) {
      console.log(err);
      setUserData(null);
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: `url('https://wallpapers.com/images/featured/iron-man-superhero-ponky3hlfivddo2m.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <form
        onSubmit={handleSignup}
        className="relative w-full max-w-sm sm:max-w-md border bg-black/20 backdrop-blur-xl border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-4"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <div className="flex items-center w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full text-white placeholder-white/60 focus:outline-none bg-transparent transition"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/70 hover:text-white transition ml-2 cursor-pointer"
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
        {error.length > 0 ? (
          <p className="text-red-500 text-center text-xl">*{error}</p>
        ) : (
          ""
        )}
        <button
          type="submit"
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg hover:shadow-xl mt-6"
          disabled={loading}
        >
          {loading ? "loading..." : "Sign Up"}
        </button>
        <p className="text-white/60 ml-2 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}
