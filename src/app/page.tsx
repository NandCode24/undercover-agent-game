"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex items-center justify-center px-4 py-16">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-900 via-black to-cyan-900 opacity-40 blur-3xl" />

      {/* Floating Circles (smaller on mobile) */}
      <motion.div
        className="absolute w-40 h-40 md:w-72 md:h-72 bg-purple-600 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-56 h-56 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -80, 50, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-md">
        {/* Title */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          UNDERCOVER
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed"
        >
          Trust nobody. Suspect everyone. <br />
          Even your best friend might be lying. 😈
        </motion.p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/create")}
          className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 shadow-xl shadow-purple-500/30 hover:shadow-cyan-400/60 transition-all duration-300"
        >
          🎮 Start the Chaos
        </motion.button>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 mt-6 text-xs sm:text-sm"
        >
          Warning: Friendships may not survive this game.
        </motion.p>
      </div>
    </div>
  );
}
