import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google"; // ✅ added

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔥 NORMAL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful 🚀");
      navigate("/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.msg || "Error");
    }
  };

  // 🔥 GOOGLE LOGIN (NO UI CHANGE)
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await API.post("/auth/google", {
          token: tokenResponse.access_token,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Google Login Successful 🚀");
        navigate("/dashboard");

      } catch (err) {
        console.log(err);
        toast.error("Google login failed ❌");
      }
    },
    onError: () => {
      toast.error("Google login failed ❌");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-green-500/20 blur-[160px] top-[-150px] left-[-150px]"></div>
      <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[160px] bottom-[-150px] right-[-150px]"></div>

      {/* 💎 CARD */}
      <div className="relative w-full max-w-lg p-10 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl 
      hover:scale-[1.01] transition duration-300">

        {/* 🔥 LOGO */}
        <div className="flex flex-col items-center mb-8">

          <div className="w-44 h-44 rounded-2xl overflow-hidden border border-white/10 
          shadow-[0_0_40px_rgba(34,197,94,0.25)]">

            <img
              src="/logo.png"
              alt="CivicLink"
              className="w-full h-full object-cover"
            />

          </div>

          <h1 className="text-4xl font-bold mt-5 tracking-wide">
            Civic<span className="text-green-400">Link</span>
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Smart Society Management
          </p>
        </div>

        {/* 🔐 FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 
            focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 
            transition placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 
            focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 
            transition placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🔥 LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 
            font-semibold transition transform hover:scale-[1.03] active:scale-95
            shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            Login
          </button>

        </form>
        <p
  onClick={() => navigate("/forgot-password")}
  className="text-sm text-gray-400 cursor-pointer hover:text-green-400 mt-3 text-center"
>
  Forgot Password?
</p>

        {/* 🔵 GOOGLE BUTTON (UI SAME, FUNCTION ADDED) */}
        <button
          onClick={() => googleLogin()} // ✅ added logic
          className="mt-5 w-full p-3 rounded-lg border border-white/20 
          hover:bg-white/10 transition flex items-center justify-center gap-3"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* 🔗 REGISTER */}
        <p className="text-center text-gray-400 text-sm mt-5">
          Don’t have an account?{" "}
          <span
            className="text-green-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;