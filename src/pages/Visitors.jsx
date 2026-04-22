import React, { useEffect, useState, Fragment } from "react"; // Added Fragment
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import AddVisitorModal from "../components/AddVisitorModal";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io("https://civiclink-c5ov.onrender.com", {
  transports: ["websocket"],
});
//visitors
const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchVisitors = async () => {
    try {
      const res = await API.get("/visitors");
      setVisitors(res.data || []);
    } catch (err) {
      toast.error("Failed to load visitors ❌");
    }
  };

  useEffect(() => {
    fetchVisitors();

    socket.on("newVisitor", (newVisitor) => {
      setVisitors((prev) => {
        if (prev.find((v) => v._id === newVisitor._id)) return prev;
        return [newVisitor, ...prev];
      });
    });

    socket.on("visitorUpdated", (updated) => {
      setVisitors((prev) =>
        prev.map((v) => (v._id === updated._id ? updated : v))
      );
    });

    return () => {
      socket.off("newVisitor");
      socket.off("visitorUpdated");
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/visitors/${id}`, { status });
      toast.success(`Visitor ${status} ✅`);
    } catch (err) {
      toast.error("Action failed ❌");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6 sm:p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Visitors Management
            </h2>

            <button
              onClick={() => setOpen(true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition font-semibold"
            >
              + Add Visitor
            </button>
          </div>

          {/* TABLE CONTAINER */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-green-400/20 via-blue-500/10 to-transparent">
            <div className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/10 backdrop-blur sticky top-0 z-10">
                  <tr className="text-gray-300 text-xs uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Flat</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visitors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-10 text-gray-400">
                        🚫 No visitors yet
                      </td>
                    </tr>
                  ) : (
                    visitors.map((v) => (
                      <Fragment key={v._id}>
                        {/* MAIN ROW */}
                        <tr
                          onClick={() =>
                            setExpandedRow(expandedRow === v._id ? null : v._id)
                          }
                          className="border-t border-white/10 group hover:bg-white/5 transition-all duration-300 cursor-pointer"
                        >
                          <td className="p-4 font-medium group-hover:text-green-400 transition">
                            {v.name}
                          </td>
                          <td className="p-4 text-gray-400">{v.phone}</td>
                          <td className="p-4 text-gray-300">{v.flatNumber}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${v.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                v.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {v.status || "pending"}
                            </span>
                          </td>
                          <td className="p-4 flex justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(v._id, "approved");
                              }}
                              className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded transition"
                            >
                              ✔
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(v._id, "rejected");
                              }}
                              className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded transition"
                            >
                              ✖
                            </button>
                          </td>
                        </tr>

                        {/* EXPANDED ROW */}
                        {expandedRow === v._id && (
                          <tr className="bg-white/5">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm animate-in fade-in duration-300">
                                <div>
                                  <p className="text-gray-400">Entry Time</p>
                                  <p>{v.entryTime ? new Date(v.entryTime).toLocaleString() : "-"}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Exit Time</p>
                                  <p>{v.exitTime ? new Date(v.exitTime).toLocaleString() : "-"}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Purpose</p>
                                  <p>{v.purpose || "Not specified"}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Visitor ID</p>
                                  <p className="truncate text-xs opacity-50">{v._id}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <AddVisitorModal
          close={() => setOpen(false)}
          refresh={fetchVisitors}
        />
      )}
    </div>
  );
};

export default Visitors;