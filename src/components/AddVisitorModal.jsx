import { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

const AddVisitorModal = ({ close, refresh }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    flatNumber: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/visitors", form);

      console.log("ADDED:", res.data); // 🔥 DEBUG

      refresh(); // 🔥 reload data
      close();

    } catch (err) {
      console.log("ERROR:", err);
      alert("Failed to add visitor");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        className="bg-[#020617] p-6 rounded-xl w-96 border border-white/10"
      >
        <h2 className="mb-4 text-lg font-semibold">Add Visitor</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Name"
            required
            className="w-full p-2 bg-white/10 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            required
            className="w-full p-2 bg-white/10 rounded"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="Flat Number"
            required
            className="w-full p-2 bg-white/10 rounded"
            onChange={(e) =>
              setForm({ ...form, flatNumber: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-green-500 p-2 rounded hover:bg-green-600 transition"
          >
            Add Visitor
          </button>

        </form>

        <button onClick={close} className="mt-3 text-red-400">
          Close
        </button>

      </motion.div>
    </motion.div>
  );
};

export default AddVisitorModal;