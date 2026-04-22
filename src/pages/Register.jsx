import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    flatNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        ...form,
        role: "resident",
      });

      toast.success("Registered Successfully 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* GLASS CARD */}
      <div className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="CivicLink"
            className="w-24 mb-3 drop-shadow-lg"
          />

          <h1 className="text-3xl font-bold">
            Civic<span className="text-green-400">Link</span>
          </h1>

          <p className="text-gray-400 text-sm">
            Create your account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            onChange={handleChange}
          />

          <input
            type="text"
            name="flatNumber"
            placeholder="Flat Number"
            className="input"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 
            font-semibold transition transform hover:scale-[1.03]"
          >
            Register
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-green-400 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;