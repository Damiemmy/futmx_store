import {
  LayoutDashboard,
  House,
  Calendar,
  Heart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const sidebarLinks = {
  user: [
    {
      title: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/dashboard/user",
    },
    {
      title: "Reservations",
      icon: <Calendar />,
      path: "/dashboard/user/reservations",
    },
    {
      title: "Favorites",
      icon: <Heart />,
      path: "/dashboard/user/favorites",
    },
    {
      title: "Settings",
      icon: <Settings />,
      path: "/dashboard/user/settings",
    },
  ],

  host: [
    {
      title: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/dashboard/host",
    },
    {
      title: "Properties",
      icon: <House />,
      path: "/dashboard/host/properties",
    },
    {
      title: "Reservations",
      icon: <Calendar />,
      path: "/dashboard/host/reservations",
    },
    {
      title: "Settings",
      icon: <Settings />,
      path: "/dashboard/host/settings",
    },
  ],

  admin: [
    {
      title: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/dashboard/admin",
    },
    {
      title: "Users",
      icon: <Users />,
      path: "/dashboard/admin/users",
    },
    {
      title: "Properties",
      icon: <House />,
      path: "/dashboard/admin/properties",
    },
    {
      title: "Settings",
      icon: <Settings />,
      path: "/dashboard/admin/settings",
    },
  ],
};

export default function Sidebar() {
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  /*
  ============================================
  GET CURRENT ROLE LINKS
  ============================================
  */

  const currentLinks = sidebarLinks[user?.role] || [];

  /*
  ============================================
  LOGOUT
  ============================================
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");

    setUser(null);

    navigate("/login");
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="
        hidden lg:flex
        flex-col justify-between
        w-[280px]
        min-h-screen
        bg-white/60
        backdrop-blur-3xl
        border-r border-white/20
        shadow-2xl
        px-6 py-10
      "
    >
      {/* TOP */}
      <div>
        {/* LOGO */}
        <h1
          className="
            text-4xl font-black mb-16
            bg-gradient-to-r from-pink-500 to-purple-600
            bg-clip-text text-transparent
          "
        >
          BookMe
        </h1>

        {/* ROLE BADGE */}
        <div className="mb-8">
          <div
            className="
              inline-block
              px-4 py-2
              rounded-full
              bg-gradient-to-r
              from-pink-500
              to-purple-600
              text-white
              text-sm
              font-semibold
              shadow-lg
              capitalize
            "
          >
            {user?.role || "guest"} Panel
          </div>
        </div>

        {/* SIDEBAR LINKS */}
        <div className="space-y-5">
          {currentLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  x: 10,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="
                  flex items-center gap-4
                  px-5 py-4
                  rounded-2xl
                  cursor-pointer
                  bg-white
                  shadow-lg
                  hover:bg-gradient-to-r
                  hover:from-pink-500
                  hover:to-purple-600
                  hover:text-white
                  transition duration-300
                  mb-4
                "
              >
                {link.icon}

                <span className="font-semibold text-lg">
                  {link.title}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="
          flex items-center gap-4
          px-5 py-4
          rounded-2xl
          bg-red-500
          text-white
          shadow-xl
          cursor-pointer
          w-full
        "
      >
        <LogOut />

        <span className="font-semibold text-lg">
          Logout
        </span>
      </motion.button>
    </motion.div>
  );
}