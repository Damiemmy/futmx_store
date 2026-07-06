import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const users = Array.from({ length: 8 });

  return (
    <div className="p-4 md:p-8 space-y-6">

      <div className="flex items-center gap-3">
        <Users className="text-pink-500" />
        <h1 className="text-3xl font-bold">Platform Users</h1>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-xl rounded-2xl p-5"
          >
            <h2 className="font-bold">User #{i + 1}</h2>
            <p className="text-gray-500">Active Traveler</p>

            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl">
              Suspend
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
}