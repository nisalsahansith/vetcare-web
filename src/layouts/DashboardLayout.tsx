import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  CalendarDays,
  FileText,
  UserRound,
  LogOut,
  HeartPulse,
} from "lucide-react";
import { clearAuth } from "../auth/AuthStorage";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Pets",
      path: "/pets",
      icon: PawPrint,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: CalendarDays,
    },
    {
      name: "Medical Records",
      path: "/medical-records",
      icon: FileText,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f4] flex">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#18352b] text-white flex-col">

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#8fc9a5] flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-[#18352b]" />
          </div>

          <div className="ml-3">
            <h1 className="font-bold text-lg">
              VetCare
            </h1>

            <p className="text-xs text-white/50">
              Pet health platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#8fc9a5] text-[#18352b]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="w-5 h-5" />

            <span className="text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;