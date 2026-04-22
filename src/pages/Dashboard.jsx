import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import { FaUsers } from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  //TIME AGO FUNCTION
const timeAgo = (time) => {
  const diff = Math.floor((Date.now() - time) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};


const markAsRead = (index) => {
  setNotifications(prev =>
    prev.map((n, i) =>
      i === index ? { ...n, isRead: true } : n
    )
  );
};
  const [visitors, setVisitors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // SOUND
  const playSound = () => {
    const audio = new Audio("/notify.mp3");
    audio.play();
  };

  const fetchVisitors = async () => {
    try {
      const res = await API.get("/visitors");
      setVisitors(res.data || []);
    } catch {
      toast.error("Failed ❌");
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        console.log("📦 Loaded:", res.data);
        const formatted = res.data.map(n => ({
  text: n.text,
  type: n.type,
  time: new Date(n.createdAt).getTime(),
  isRead: n.isRead || false
}));

setNotifications(formatted);
      } catch (err) {
        console.log(err);
      }
    };

    loadNotifications();
  }, []);

  
  useEffect(() => {
    console.log("🚀 Listening for notifications");

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("newNotification", (data) => {
  setNotifications(prev => [
    {
      text: data.text,
      type: data.type,
      time: Date.now(),
      isRead: false
    },
    ...prev
  ]);

  playSound();
  
  setShowNotif(true);
});

    return () => {
      socket.off("newNotification");
    };
  }, []);

  
  const handleStatus = async (id, status) => {
    try {
      await API.put(`/visitors/${id}`, { status });
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    fetchVisitors();
  }, []);

  const total = visitors.length;
  const approved = visitors.filter(v => v.status === "approved").length;
  const rejected = visitors.filter(v => v.status === "rejected").length;
  const pending = visitors.filter(v => !v.status || v.status === "pending").length;

  const data = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    
    <div className="flex min-h-screen bg-[#020617] text-white">

  {/* MOBILE OVERLAY */}
  {openSidebar && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
    onClick={() => setOpenSidebar(false)}
  />
)}

  {/* SIDEBAR */}
  <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

  <div className="flex-1 flex flex-col">
    <Navbar setOpenSidebar={setOpenSidebar} />

        <div className="p-4 md:p-6">

          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h1 className="text-xl md:text-3xl font-bold 
            bg-gradient-to-r from-green-400 to-blue-500 
            bg-clip-text text-transparent">
              Dashboard Overview
            </h1>

            {/*NOTIFICATION */}
            <div className="relative">
              <button
                onClick={async () => {
  setShowNotif(!showNotif);

  if (!showNotif) {
    
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );

    
    try {
      await API.put("/notifications/read-all");
    } catch (err) {
      console.log(err);
    }
  }
}}
                className="relative text-xl"
              >
                🔔
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-3 w-72 max-h-72 overflow-y-auto 
                bg-[#020617]/90 backdrop-blur-xl border border-white/10 
                rounded-xl p-3 shadow-lg z-50">
{/* HEADER */}
<div className="flex justify-between items-center mb-2">
  <h3 className="text-sm text-gray-300">Notifications</h3>

  <button
    onClick={() => setNotifications([])}
    className="text-xs text-red-400"
  >
    Clear
  </button>
</div>

{/* LIST */}
{notifications.length === 0 ? (
  <p className="text-sm text-gray-500 text-center py-4">
    No notifications
  </p>
) : (
  notifications.map((n, i) => (
    <div
      key={n.time || i}
      onClick={() => markAsRead(i)}
      className={`flex items-start gap-2 p-2 mb-2 rounded-lg cursor-pointer
      ${n.isRead 
        ? "bg-white/5" 
        : "bg-blue-500/10 border border-blue-400/30"}
      `}
    >
      {!n.isRead && (
        <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
      )}

      <div className="flex-1">
        <p className="text-sm text-white">
  {n.type === "announcement" && "📢 "}
  {n.type === "visitor" && "🚶 "}
  {n.type === "complaint" && "🛠 "}
  {n.text}
</p>
        <p className="text-xs text-gray-400">
          {timeAgo(n.time)}
        </p>
      </div>
    </div>
  ))
)}
                  
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/visitors")}
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-green-400 to-blue-500 
              text-black hover:scale-105 transition shadow-lg"
            >
              + Add Visitor
            </button>
          </div>

          
          {/* STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
  {[
    { label: "Total", value: total, color: "from-blue-400 to-cyan-500" },
    { label: "Approved", value: approved, color: "from-green-400 to-emerald-500" },
    { label: "Pending", value: pending, color: "from-yellow-400 to-orange-500" },
    { label: "Rejected", value: rejected, color: "from-red-400 to-pink-500" },
  ].map((item, i) => (
    <motion.div
      key={i}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${item.color} group`}
    >
      <div className={`absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition bg-gradient-to-br ${item.color}`}></div>

      <div className="relative p-4 md:p-5 rounded-2xl bg-[#020617]/90 backdrop-blur-xl border border-white/10">
        <p className="text-xs md:text-sm text-gray-400">{item.label}</p>
        <h2 className="text-xl md:text-3xl font-bold mt-1 text-white">
          <CountUp end={item.value} />
        </h2>
      </div>
    </motion.div>
  ))}
</div>

{/* CHART */}
<div className="mb-10">
  <h2 className="text-lg md:text-xl mb-3 text-gray-300">Analytics</h2>

  <div className="w-full h-[300px] min-h-[350px]">
    <div className="w-full h-full bg-white/5 rounded-2xl p-4 border border-white/10">

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

    </div>
  </div>
</div>

{/* VISITORS */}
<div className="mb-6">
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 text-lg md:text-xl font-semibold 
    bg-gradient-to-r from-green-400 to-blue-500 
    bg-clip-text text-transparent"
  >
    <FaUsers className="text-green-400" />
    Recent Visitors
  </motion.h2>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

    {visitors.slice(0, 6).map((v) => (
      <motion.div
        key={v._id}
        whileHover={{ scale: 1.05, y: -6 }}
        className="relative p-[1px] rounded-2xl 
        bg-gradient-to-br from-green-400/40 to-blue-500/40 group"
      >
        <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition
        bg-gradient-to-br from-green-400 to-blue-500"></div>

        <div className="relative p-5 rounded-2xl 
        bg-[#020617]/90 backdrop-blur-xl border border-white/10">

          <h3 className="font-semibold text-white text-lg">
            {v.name}
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            {v.purpose || "No purpose"}
          </p>

          <span className="mt-3 inline-block px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
            {v.status || "pending"}
          </span>

        </div>
      </motion.div>
    ))}

  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// dashboard