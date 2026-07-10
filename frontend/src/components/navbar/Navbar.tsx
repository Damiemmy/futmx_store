// import { Bell, Search } from "lucide-react";
// import { motion } from "framer-motion";

// export default function Navbar() {
//   return (
//     <motion.div
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-lg"
//     >
//       <div className="flex items-center justify-between px-8 py-5">

//         <div>
//           <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
//             Dashboard
//           </h1>
//         </div>

//         <div className="hidden md:flex items-center bg-white rounded-full px-4 py-3 shadow-lg w-[350px]">
//           <Search className="text-gray-400" />

//           <input
//             type="text"
//             placeholder="Search anything..."
//             className="outline-none px-3 bg-transparent w-full"
//           />
//         </div>

//         <div className="flex items-center gap-5">
//           <div className="relative bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition duration-300">
//             <Bell />

//             <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </div>

//           <img
//             src="https://i.pravatar.cc/150?img=12"
//             className="w-12 h-12 rounded-full border-4 border-pink-500 shadow-xl"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import {
  Bell,
  Search,
  Menu,
  Shield,
  House,
  User,
} from "lucide-react";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  /*
  ============================================
  DYNAMIC ROLE CONFIG
  ============================================
  */

  const roleConfig = {
    admin: {
      title: "Admin Dashboard",
      icon: <Shield className="text-red-500" />,
      color: "from-red-500 to-orange-500",
    },

    host: {
      title: "Host Dashboard",
      icon: <House className="text-pink-500" />,
      color: "from-pink-500 to-purple-600",
    },

    user: {
      title: "Traveler Dashboard",
      icon: <User className="text-blue-500" />,
      color: "from-blue-500 to-indigo-600",
    },
  };

  const currentRole =
    roleConfig[user?.role] || roleConfig.user;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        sticky top-0 z-40
        bg-white/70
        backdrop-blur-2xl
        border-b border-white/20
        shadow-lg
      "
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-5">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden bg-white p-3 rounded-full shadow-lg cursor-pointer">
            <Menu />
          </div>

          {/* TITLE */}
          <div>
            <div className="flex items-center gap-3">

              {currentRole.icon}

              <h1
                className={`
                  text-2xl lg:text-3xl
                  font-black
                  bg-gradient-to-r
                  ${currentRole.color}
                  bg-clip-text
                  text-transparent
                `}
              >
                {currentRole.title}
              </h1>
            </div>

            <p className="text-gray-500 text-sm mt-1 hidden md:block">
              Welcome back, {user?.username || "Guest"}
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div
          className="
            hidden md:flex
            items-center
            bg-white
            rounded-full
            px-4 py-3
            shadow-lg
            w-[350px]
          "
        >
          <Search className="text-gray-400" />

          <input
            type="text"
            placeholder="Search properties, users..."
            className="outline-none px-3 bg-transparent w-full"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 lg:gap-5">

          {/* NOTIFICATION */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="
              relative
              bg-white
              p-3
              rounded-full
              shadow-lg
              cursor-pointer
            "
          >
            <Bell />

            <span
              className="
                absolute top-1 right-1
                w-3 h-3
                bg-red-500
                rounded-full
              "
            ></span>
          </motion.div>

          {/* PROFILE */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="
              flex items-center gap-3
              bg-white
              px-3 py-2
              rounded-full
              shadow-lg
              cursor-pointer
            "
          >
            <img
              src="https://i.pravatar.cc/150?img=12"
              className="
                w-11 h-11
                rounded-full
                border-4 border-pink-500
                shadow-xl
                object-cover
              "
            />

            <div className="hidden lg:block">
              <h2 className="font-bold text-sm">
                {user?.username || "Guest"}
              </h2>

              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "user"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}