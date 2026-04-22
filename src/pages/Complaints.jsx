import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useState } from "react";

const Complaints = () => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchComplaints = async () => {
        try {
            const res = await API.get("/complaints");
            setComplaints(res.data || []);
        } catch {
            toast.error("Failed ❌");
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter((c) => {
        return (
            (c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase())) &&
            (statusFilter === "all" || c.status === statusFilter) &&
            (priorityFilter === "all" || c.priority === priorityFilter)
        );
    });

    const addComplaint = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            toast.error("All fields required ❌");
            return;
        }

        try {
            setLoading(true);

            await API.post("/complaints", {
                title,
                description,
                priority,
            });

            toast.success("Complaint submitted 🚀");

            setTitle("");
            setDescription("");
            setPriority("medium");

            // smooth close
            setTimeout(() => {
                setOpen(false);
            }, 300);

            fetchComplaints();

        } catch {
            toast.error("Failed ❌");
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === "pending").length,
        progress: complaints.filter((c) => c.status === "in-progress").length,
        resolved: complaints.filter((c) => c.status === "resolved").length,
    };
    const handleResolve = async (id) => {
        try {
            await API.put(`/complaints/${id}`, { status: "resolved" });
            toast.success("Marked as resolved ✅");
            fetchComplaints();
        } catch {
            toast.error("Failed ❌");
        }
    };

    const handleProgress = async (id) => {
        try {
            await API.put(`/complaints/${id}`, { status: "in-progress" });
            toast.success("Marked as in progress 🔵");
            fetchComplaints();
        } catch {
            toast.error("Failed ❌");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <div className="p-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold 
            bg-gradient-to-r from-green-400 to-blue-500 
            bg-clip-text text-transparent">
                            Complaints Management
                        </h2>

                        {user?.role === "resident" && (
                            <button
                                onClick={() => setOpen(true)}
                                className="px-5 py-2 rounded-xl 
                bg-gradient-to-r from-green-400 to-blue-500 
                hover:scale-105 transition shadow-lg"
                            >
                                + Add Complaint
                            </button>
                        )}
                    </div>
                    {open && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <form
                                onSubmit={addComplaint}
                                className="bg-[#020617] p-6 rounded-2xl border border-white/10 w-[90%] max-w-md"
                            >
                                <h2 className="text-xl mb-4">Add Complaint</h2>

                                <input
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full mb-3 px-4 py-2 rounded bg-white/5 border border-white/20"
                                />

                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full mb-3 px-4 py-2 rounded bg-white/5 border border-white/20"
                                />

                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full mb-4 px-4 py-2 bg-[#020617] border border-white/20 rounded"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>

                                <div className="flex gap-2">

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 py-2 rounded transition
      ${loading
                                                ? "bg-gray-600 cursor-not-allowed"
                                                : "bg-green-500/20 text-green-400 hover:bg-green-500/40"
                                            }`}
                                    >
                                        {loading ? "Submitting..." : "Submit"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 py-2 bg-red-500/20 text-red-400 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Total", value: stats.total, color: "from-purple-500 to-indigo-500" },
                            { label: "Pending", value: stats.pending, color: "from-yellow-400 to-orange-500" },
                            { label: "In Progress", value: stats.progress, color: "from-blue-500 to-cyan-500" },
                            { label: "Resolved", value: stats.resolved, color: "from-green-500 to-emerald-500" },
                        ].map((item, i) => (
                            <div key={i} className={`relative group p-5 rounded-2xl overflow-hidden bg-gradient-to-r ${item.color}`}>
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 blur-xl"></div>
                                <p className="text-sm text-white/80">{item.label}</p>
                                <h2 className="text-3xl font-bold text-white mt-1">
                                    <CountUp end={item.value} />
                                </h2>
                            </div>
                        ))}
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-4 mb-6">
                        <input
                            placeholder="Search complaints..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/20"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-[#020617] text-white border border-white/20 rounded"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2 bg-[#020617] text-white border border-white/20 rounded"
                        >
                            <option value="all">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* CARDS */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredComplaints.map((c) => {

                            //  FIX CASE ISSUE
                            const priority = c.priority?.toLowerCase();
                            const status = c.status?.toLowerCase();

                            return (
                                <motion.div
                                    key={c._id}
                                    whileHover={{ scale: 1.05, y: -6 }}
                                    className="relative rounded-2xl p-[1px] bg-gradient-to-br from-green-400/50 to-blue-500/40 group"
                                >
                                    <div className="absolute inset-0 blur-xl opacity-20 bg-gradient-to-br from-green-400 to-blue-500 group-hover:opacity-40"></div>

                                    <div className="relative p-5 rounded-2xl bg-[#020617]/90 border border-white/10">

                                        {/*  PRIORITY LINE */}
                                        <div className={`h-1 w-full mb-3 rounded-full
                      ${priority === "high"
                                                ? "bg-red-500 shadow-[0_0_10px_red]"
                                                : priority === "medium"
                                                    ? "bg-yellow-400 shadow-[0_0_10px_yellow]"
                                                    : "bg-green-400 shadow-[0_0_10px_green]"
                                            }
                    `}></div>

                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            {priority === "high" && (
                                                <span className="text-red-400 animate-pulse">⚠️</span>
                                            )}
                                            {c.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            👤 {c.createdBy?.name || "User"} • 🏠 {c.createdBy?.flatNumber || "N/A"}
                                        </p>

                                        <p className="text-gray-400 text-sm mt-1 mb-3">{c.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            🕒 {new Date(c.createdAt).toLocaleString()}
                                        </p>

                                        <div className="flex justify-between items-center mt-4">

                                            <span className={`px-3 py-1 text-xs rounded-full
                        ${priority === "high"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : priority === "medium"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : "bg-green-500/20 text-green-400"
                                                }
                      `}>
                                                {c.priority}
                                            </span>

                                            <span className={`px-3 py-1 text-xs rounded-full
                        ${status === "resolved"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : status === "in-progress"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : "bg-yellow-500/20 text-yellow-400"
                                                }
                      `}>
                                                {c.status}
                                            </span>

                                        </div>

                                        {user?.role === "admin" && (
                                            <div className="flex gap-2 mt-3">

                                                {/* 🔵 IN PROGRESS */}
                                                {status === "pending" && (
                                                    <button
                                                        onClick={() => handleProgress(c._id)}
                                                        className="flex-1 py-2 rounded-lg 
        bg-blue-500/20 text-blue-400 
        hover:bg-blue-500/40 transition"
                                                    >
                                                        In Progress
                                                    </button>
                                                )}

                                                {/* 🟢 RESOLVE */}
                                                {status === "in-progress" && (
                                                    <button
                                                        onClick={() => handleResolve(c._id)}
                                                        className="flex-1 py-2 rounded-lg 
        bg-green-500/20 text-green-400 
        hover:bg-green-500/40 transition"
                                                    >
                                                        Resolve
                                                    </button>
                                                )}

                                            </div>
                                        )}

                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Complaints;