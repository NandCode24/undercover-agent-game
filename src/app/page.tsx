"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-900 via-black to-cyan-900 opacity-40 blur-3xl animate-pulse" />

      {/* Floating Decorative Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -120, 80, 0], y: [0, 100, -60, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        {/* Title */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-extrabold tracking-widest mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          UNDERCOVER
        </motion.h1>

        {/* Funny Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-300 text-lg md:text-xl mb-10"
        >
          Trust nobody. Suspect everyone. <br />
          Even your best friend might be lying. 😈
        </motion.p>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/create")}
          className="px-10 py-4 text-lg font-bold rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 shadow-xl shadow-purple-500/40 hover:shadow-cyan-400/60 transition-all duration-300"
        >
          🎮 Start the Chaos
        </motion.button>

        {/* Secondary Funny Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-gray-500 mt-8 text-sm"
        >
          Warning: Friendships may not survive this game.
        </motion.p>
      </div>
    </div>
  );
}
