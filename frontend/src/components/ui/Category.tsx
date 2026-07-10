// components/Categories.jsx

"use client";

import {
  Home,
  Building2,
  Tent,
  Trees,
  Waves,
  Castle,
} from "lucide-react";

import { motion } from "framer-motion";

const categories = [
  {
    title: "Apartments",
    icon: <Building2 size={28} />,
  },
  {
    title: "Beach",
    icon: <Waves size={28} />,
  },
  {
    title: "Cabins",
    icon: <Trees size={28} />,
  },
  {
    title: "Camping",
    icon: <Tent size={28} />,
  },
  {
    title: "Luxury",
    icon: <Castle size={28} />,
  },
  {
    title: "Homes",
    icon: <Home size={28} />,
  },
];

export default function Categories() {
  return (
    <section className="py-10 px-6 bg-white border-b">
      <div className="max-w-7xl mx-auto overflow-x-auto">
        
        <div className="flex gap-6 min-w-max">

          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-3 cursor-pointer text-gray-600 hover:text-pink-500 transition"
            >
              <div className="bg-gray-100 hover:bg-pink-100 transition w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                {category.icon}
              </div>

              <span className="font-medium text-sm">
                {category.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}