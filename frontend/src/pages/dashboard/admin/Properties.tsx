import { motion } from "framer-motion";

export default function AdminProperties() {
  const properties = Array.from({ length: 8 });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">All Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <img
              src={`https://source.unsplash.com/400x300/?house,${i}`}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold">Luxury Apartment #{i + 1}</h2>
              <p className="text-gray-500">Lagos, Nigeria</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}