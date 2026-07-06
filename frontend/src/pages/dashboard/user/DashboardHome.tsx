import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { motion } from "framer-motion";

export default function UserDashboard() {
  return (
    <div className="flex bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 min-h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[40px] p-10 text-white shadow-2xl mb-12"
          >
            <h1 className="text-5xl font-black mb-4">
              Your Travel World 🌍
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl">
              Track reservations, favorite properties,
              experiences and your dream destinations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {[
              {
                title: "Reservations",
                value: "12",
              },
              {
                title: "Favorites",
                value: "28",
              },
              {
                title: "Trips",
                value: "7",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-[35px] p-8 shadow-2xl"
              >
                <h2 className="text-gray-500 text-lg mb-4">
                  {card.title}
                </h2>

                <h1 className="text-6xl font-black text-gray-900">
                  {card.value}
                </h1>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}