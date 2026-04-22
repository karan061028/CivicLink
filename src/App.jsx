import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Visitors from "./pages/Visitors";
import Complaints from "./pages/Complaints";
import Announcements from "./pages/Announcements";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          {/* ✅ ADD THIS */}
          <Route path="/login" element={<Login />} />

          {/* ✅ KEEP THIS (optional but good) */}
          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;