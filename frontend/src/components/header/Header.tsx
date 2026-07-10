// components/Header.tsx

"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  UserCircle2,
  Heart,
  Building2,
  CalendarDays,
  LogOut,
  Shield,
  X,
  PlusCircle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/login");
  };

  const formatName = (name) =>
    name
      ?.toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const avatar = user?.username?.charAt(0)?.toUpperCase() || "G";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
            BM
          </div>

          <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Book Me
          </h1>
        </Link>

        {/* SEARCH (DESKTOP ONLY) */}
        <div className="hidden md:flex items-center bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition">
          <input
            type="text"
            placeholder="Search stays, cities..."
            className="outline-none bg-transparent px-2 w-60"
          />
          <button className="bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600">
            <Search size={18} />
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* ROLE ACTIONS */}
          {user?.role === "user" && (
            <Link
              to="/become-host"
              className="hidden md:block text-sm font-semibold hover:text-pink-500"
            >
              Become a Host
            </Link>
          )}

          {user?.role === "host" && (
            <Link
              to="/add-property"
              className="hidden md:flex items-center gap-1 text-sm font-semibold hover:text-pink-500"
            >
              <PlusCircle size={16} /> Add Property
            </Link>
          )}

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2 border rounded-full px-3 py-2 shadow-sm hover:shadow-md bg-white"
          >
            {openMenu ? <X size={18} /> : <Menu size={18} />}

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white flex items-center justify-center text-sm font-bold">
              {avatar}
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE / DESKTOP DROPDOWN */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-4 md:right-10 mt-2 w-[92%] md:w-80 bg-white rounded-2xl shadow-xl border overflow-hidden"
          >

            {/* USER HEADER */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-5 text-white">
              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                  {avatar}
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    {formatName(user?.username) || "Guest"}
                  </h2>

                  <p className="text-xs opacity-90">
                    {user?.role || "guest"} account
                  </p>
                </div>
              </div>
            </div>

            {/* MENU */}
            <div className="p-2 space-y-1">

              {isAuthenticated ? (
                <>
                  <MenuItem icon={<Heart size={18} />} text="Favourites" to="/favourites" setOpenMenu={setOpenMenu} />
                  <MenuItem icon={<CalendarDays size={18} />} text="Reservations" to="/reservations" setOpenMenu={setOpenMenu} />

                  {user?.role === "host" && (
                    <MenuItem icon={<Building2 size={18} />} text="My Properties" to="/my-properties" setOpenMenu={setOpenMenu} />
                  )}

                  {user?.role === "admin" && (
                    <MenuItem icon={<Shield size={18} />} text="Admin Dashboard" to="/dashboard" setOpenMenu={setOpenMenu} />
                  )}
                  {user?.role === "host" && (
                    <MenuItem icon={<Shield size={18} />} text="Host Dashboard" to="/dashboard" setOpenMenu={setOpenMenu} />
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MenuItem text="Login" to="/login" setOpenMenu={setOpenMenu} />
                  <MenuItem text="Register" to="/register" setOpenMenu={setOpenMenu} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* MENU ITEM */
function MenuItem({ icon, text, to, setOpenMenu }) {
  return (
    <Link
      to={to}
      onClick={() => setOpenMenu(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
    >
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </Link>
  );
}