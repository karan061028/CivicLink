import { Home, Users, FileText, Bell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Visitors", icon: Users, path: "/visitors" },
    { name: "Complaints", icon: FileText, path: "/complaints" },
    { name: "Announcements", icon: Bell, path: "/announcements" },
  ];

  return (
    <div className="hidden md:flex h-screen w-64 bg-gradient-to-b from-black to-[#020617] 
border-r border-green-500/20 p-6 flex-col shadow-[0_0_40px_rgba(34,197,94,0.2)]">


      
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
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
              ${
                active
                  ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-105"
                  : "hover:bg-white/10 hover:scale-105"
              }`}
            >
              <Icon size={22} />
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