import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";

import { motion } from "framer-motion";

export default function HostDashboard() {
  return (
    <div className="flex bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 min-h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-[40px] p-10 text-white shadow-2xl mb-12"
          >
            <h1 className="text-5xl font-black mb-4">
              Welcome Back Host 👋
            </h1>

            <p className="text-xl text-pink-100 max-w-2xl">
              Manage your properties, reservations,
              earnings and grow your hosting business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

            {[
              "Properties",
              "Reservations",
              "Earnings",
              "Reviews",
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-white rounded-[35px] p-8 shadow-2xl"
              >
                <h2 className="text-gray-500 text-lg mb-4">
                  {item}
                </h2>

                <h1 className="text-5xl font-black text-gray-900">
                  {Math.floor(Math.random() * 100)}
                </h1>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}