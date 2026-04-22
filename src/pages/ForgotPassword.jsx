import { useState, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  // 🔥 TIMER
  const startTimer = () => {
    let t = 30;
    setTimer(t);

    const interval = setInterval(() => {
      t--;
      setTimer(t);
      if (t <= 0) clearInterval(interval);
    }, 1000);
  };

  // 🔥 SEND OTP
  const sendOtp = async () => {
    try {
      const res = await API.post("/auth/send-otp", { email });

      toast.success("OTP Sent 🚀");
      console.log("OTP:", res.data.otp); // testing

      setStep(2);
      startTimer();

    } catch {
      toast.error("Failed ❌");
    }
  };

  // 🔥 RESEND OTP
  const resendOtp = () => {
    if (timer > 0) return;
    sendOtp();
  };

  // 🔥 OTP INPUT HANDLER
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // 👉 Auto focus next
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // 🔥 BACKSPACE HANDLER
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // 🔥 VERIFY OTP
  const verifyOtp = async () => {
    try {
      const fullOtp = otp.join("");

      await API.post("/auth/verify-otp", { email, otp: fullOtp });

      toast.success("OTP Verified ✅");
      setStep(3);

    } catch {
      toast.error("Invalid OTP ❌");
    }
  };

  // 🔥 RESET PASSWORD
  const resetPassword = async () => {
    try {
      const fullOtp = otp.join("");

      await API.post("/auth/reset-password", {
        email,
        otp: fullOtp,
        newPassword,
      });

      toast.success("Password Reset Successful 🔐");
      setStep(1);

    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">

      {/* 🔥 GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[150px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[150px] bottom-[-100px] right-[-100px]"></div>

      {/* 💎 CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password 🔐
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 mb-4"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="flex justify-between mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-12 text-center text-lg bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-400"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 mb-3"
            >
              Verify OTP
            </button>

            <p className="text-center text-sm text-gray-400">
              {timer > 0 ? (
                `Resend in ${timer}s`
              ) : (
                <span
                  onClick={resendOtp}
                  className="text-purple-400 cursor-pointer hover:underline"
                >
                  Resend OTP
                </span>
              )}
            </p>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 mb-4"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              className="w-full p-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105"
            >
              Reset Password
            </button>
          </>
        )}

      </motion.div>
    </div>
  );
};

export default ForgotPassword;