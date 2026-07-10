// components/Footer.tsx

"use client";

import { motion } from "framer-motion";
import { FaTwitter,FaInstagram,FaLinkedin,FaFacebook} from "react-icons/fa"
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Book Me
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Discover beautiful stays, unique experiences, and unforgettable
            adventures around the world.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            Company
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/become-host"
                className="hover:text-white transition"
              >
                Become a Host
              </Link>
            </li>

            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-white transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            Support
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Help Center
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-white transition">
                Cancellation Options
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-white transition">
                Safety Information
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-white transition">
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIALS */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            Connect
          </h3>

          <div className="flex gap-4">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="bg-white/10 p-3 rounded-full hover:bg-pink-500 transition"
            >
              <FaFacebook />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="bg-white/10 p-3 rounded-full hover:bg-pink-500 transition"
            >
              <FaInstagram />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="bg-white/10 p-3 rounded-full hover:bg-pink-500 transition"
            >
              <FaTwitter />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="bg-white/10 p-3 rounded-full hover:bg-pink-500 transition"
            >
              <FaLinkedin />
            </motion.a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
        © 2026 Book Me. All rights reserved.
      </div>
    </footer>
  );
}