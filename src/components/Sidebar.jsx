import { Home, Users, FileText, Bell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Visitors", icon: Users, path: "/visitors" },
    { name: "Complaints", icon: FileText, path: "/complaints" },
    { name: "Announcements", icon: Bell, path: "/announcements" },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen w-[80%] md:w-64
bg-[#020617]/80 backdrop-blur-2xl
border-r border-white/10
p-6 flex flex-col
shadow-[0_0_60px_rgba(34,197,94,0.15)]
transform transition-all duration-300 ease-in-out z-50

${openSidebar ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
md:translate-x-0 md:opacity-100 md:static
`}>

      <button
        className="md:hidden text-white text-xl mb-6 self-end"
        onClick={() => setOpenSidebar(false)}
      >
        ✖
      </button>



      <h1 className="text-3xl font-bold mb-12 text-white">
        Civic<span className="text-green-400">Link</span>
      </h1>

      {/* MENU */}
      <nav className="space-y-4">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <div
              key={index}
              onClick={() => {
                navigate(item.path);
                setOpenSidebar(false); // close on mobile
              }}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
              ${active
                  ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-105"
                  : "hover:bg-white/10 hover:scale-105"
                }`}
            >
              <Icon
                size={22}
                className="transition-transform duration-300 group-hover:rotate-6"
              />
              <span className="font-medium">{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto text-xs text-gray-500">
      </div>
    </div>
  );
};

export default Sidebar;