import { Home, Users, FileText, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { icon: Home, path: "/dashboard" },
    { icon: Users, path: "/visitors" },
    { icon: FileText, path: "/complaints" },
    { icon: Bell, path: "/announcements" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#020617] border-t border-white/10 flex justify-around py-2 z-50">
      {menu.map((item, i) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className={`p-2 ${active ? "text-green-400" : "text-gray-400"}`}
          >
            <Icon size={22} />
          </div>
        );
      })}
    </div>
  );
};

export default MobileNav;