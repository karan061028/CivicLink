import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Visitors from "./pages/Visitors";
import Complaints from "./pages/Complaints";
import Announcements from "./pages/Announcements";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              localStorage.getItem("token") ? <Dashboard /> : <Login />
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/visitors" element={
            <ProtectedRoute><Visitors /></ProtectedRoute>
          } />

          <Route path="/complaints" element={
            <ProtectedRoute><Complaints /></ProtectedRoute>
          } />

          <Route path="/announcements" element={
            <ProtectedRoute><Announcements /></ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;