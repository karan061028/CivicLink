import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import socket from "../socket";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Announcements = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")); // 🔥 ADD THIS

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    eventDate: null,
    amount: "",
    isPaidRequired: false,
  });

  //FETCH
  const fetchAnnouncements = async () => {
    try {
      const res = await API.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      toast.error("Failed to load ❌");
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    //DEBUG CONNECTION
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    // RECEIVE NEW ANNOUNCEMENT
    socket.on("newAnnouncement", (data) => {
      console.log("🔥 RECEIVED:", data);

      setAnnouncements((prev) => [data, ...prev]);
    });

    //DELETE
    socket.on("deleteAnnouncement", (id) => {
      setAnnouncements((prev) =>
        prev.filter((a) => a._id !== id)
      );
    });

    return () => {
      socket.off("connect");
      socket.off("newAnnouncement");
      socket.off("deleteAnnouncement");
    };
  }, []);

  //DELETE
  const deleteAnnouncement = async (id) => {
    if (user?.role !== "admin") {
      toast.error("Only admin can delete ❌");
      return;
    }

    if (!window.confirm("Delete this announcement?")) return;

    try {
      await API.delete(`/announcements/${id}`);
      toast.success("Deleted 🗑");

      setAnnouncements((prev) =>
        prev.filter((a) => a._id !== id)
      );

    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role !== "admin") {
      toast.error("Only admin can post ❌");
      return;
    }

    if (!form.title || !form.message) {
      toast.error("Title & Message required ❌");
      return;
    }

    try {
      const res = await API.post("/announcements", {
        ...form,
        eventDate: form.eventDate
          ? new Date(form.eventDate).toISOString()
          : null,
      });

      
      setAnnouncements(prev => [res.data, ...prev]);

      toast.success("Announcement posted 📢");

      setForm({
        title: "",
        message: "",
        type: "general",
        eventDate: null,   
        amount: "",
        isPaidRequired: false,
      });

      setOpen(false);
      // fetchAnnouncements();

    } catch (err) {
      console.log(err);
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <div className="flex-1 flex flex-col">
        <Navbar setOpenSidebar={setOpenSidebar} />

        <div className="p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Announcements
            </h2>

            {/* 🔥 ADMIN ONLY BUTTON */}
            {user?.role === "admin" && (
              <button
                onClick={() => setOpen(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition"
              >
                + Add Announcement
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="space-y-6">

            {announcements.length === 0 ? (
              <p className="text-gray-400">No announcements</p>
            ) : (
              announcements.map((a) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group rounded-2xl p-[1px] 
                  bg-gradient-to-br from-green-400/30 via-blue-500/20 to-transparent"
                >

                  <div className="rounded-2xl p-5 bg-[#020617]/80 backdrop-blur-xl 
                  border border-white/10 shadow-xl">

                    {/* TITLE + DELETE */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">
                        📢 {a.title}
                      </h3>

                      {/* 🔥 ADMIN ONLY DELETE */}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => deleteAnnouncement(a._id)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          🗑
                        </button>
                      )}
                    </div>

                    <p className="text-gray-300">{a.message}</p>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium tracking-wide
  ${a.type === "payment"
                          ? "bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                          : a.type === "festival"
                            ? "bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                            : "bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                        }
`}>
                        {a.type === "payment" && "💰 Payment"}
                        {a.type === "festival" && "🎉 Festival"}
                        {a.type === "general" && "📢 General"}
                      </span>

                      {a.eventDate && (
                        <span>
                          📅 {new Date(a.eventDate).toLocaleDateString()}
                        </span>
                      )}

                      {(a.type === "payment" || a.isPaidRequired) && (
                        <span className="text-yellow-400">
                          💰 ₹{a.amount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>

                  </div>

                </motion.div>
              ))
            )}

          </div>

        </div>
      </div>

      {/* MODAL */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-[#020617] p-6 rounded-xl w-96 border border-white/10"
          >

            <h3 className="mb-4 font-semibold">New Announcement</h3>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
  placeholder="Title"
  value={form.title}
  onChange={(e) =>
    setForm(prev => ({ ...prev, title: e.target.value }))
  }
  className="w-full p-2 bg-white/10 rounded"
/>

<textarea
  placeholder="Message"
  value={form.message}
  onChange={(e) =>
    setForm(prev => ({ ...prev, message: e.target.value }))
  }
  className="w-full p-2 bg-white/10 rounded"
/>

<select
  value={form.type}
  onChange={(e) => {
    const selectedType = e.target.value;

    setForm(prev => ({
      ...prev,
      type: selectedType,
      isPaidRequired: selectedType === "payment"
    }));
  }}
  className="w-full p-2 rounded bg-[#0f172a] text-white border border-white/20"
>
  <option value="general">General</option>
  <option value="festival">Festival</option>
  <option value="payment">Payment</option>
</select>

              {/*EVENT DATE (ONLY FOR FESTIVAL) */}
              <DatePicker
                selected={form.eventDate}
                onChange={(date) =>
                  setForm({ ...form, eventDate: date })
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                className="w-full p-2 rounded-lg 
  bg-[#0f172a] text-white 
  border border-white/20 
  focus:outline-none focus:ring-2 focus:ring-blue-500
  shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                calendarClassName="react-datepicker"
              />


              {/* 🔥 PAYMENT AMOUNT */}
              {/* 🔥 PAYMENT AMOUNT */}
{form.type === "payment" && (
  <input
    type="number"
    placeholder="Amount"
    value={form.amount}
    onChange={(e) =>
      setForm(prev => ({
        ...prev,
        amount: e.target.value
      }))
    }
    className="w-full p-2 bg-white/10 rounded"
  />
)}
              


              <button type="submit" className="w-full bg-green-500 p-2 rounded">
                Post
              </button>

            </form>

            <button
              onClick={() => setOpen(false)}
              className="mt-3 text-red-400"
            >
              Close
            </button>

          </motion.div>
        </motion.div>
      )}

    </div>
  );
};

export default Announcements;