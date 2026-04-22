import { useNavigate } from "react-router-dom";

const Navbar = ({ setOpenSidebar }) => {
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));

  //LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-16 flex items-center justify-between px-6
    bg-[#020617]/80 backdrop-blur-xl
    border-b border-white/10
    shadow-[0_5px_20px_rgba(0,0,0,0.4)]">

      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-2xl text-white hover:scale-110 transition"
          onClick={() => setOpenSidebar(true)}
        >
          ☰
        </button>

        <h2 className="text-lg font-semibold tracking-wide text-gray-200">
          Dashboard Overview
        </h2>

      </div>


      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* STATUS DOT */}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>

        {/* USER */}
        <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-white/5 border border-white/10">

          {/* PROFILE CIRCLE */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>

          {/* NAME */}
          <span className="text-sm text-gray-300">
            {user?.name || "User"}
          </span>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;