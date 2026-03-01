"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col items-center justify-start px-4 py-16">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-900 via-black to-cyan-900 opacity-40 blur-3xl" />

      {/* Floating Circles */}
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

      {/* Main Content */}
      <div className="relative z-10 text-center w-full max-w-md mt-20">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          UNDERCOVER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed"
        >
          Trust nobody. Suspect everyone. <br />
          Even your best friend might be lying. 😈
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/create")}
          className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 shadow-xl shadow-purple-500/30 hover:shadow-cyan-400/60 transition-all duration-300"
        >
          🎮 Start the Chaos
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 mt-6 text-xs sm:text-sm"
        >
          Warning: Friendships may not survive this game.
        </motion.p>
      </div>

      {/* SEO CONTENT SECTION */}
      <section className="relative z-10 max-w-3xl mt-24 text-gray-300 px-4 pb-20 text-left">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          What is Undercover Game?
        </h2>
        <p className="mb-6 leading-relaxed">
          Undercover Game is a fun multiplayer word guessing party game. Most
          players receive the same secret word, but one player gets a different
          word. The goal is to find the undercover player before they fool
          everyone.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          How to Play Undercover Online
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Each player receives a secret word.</li>
          <li>One player is undercover.</li>
          <li>Players describe their word without revealing it.</li>
          <li>Vote to eliminate the suspicious player.</li>
          <li>If civilians eliminate all special roles, they win.</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-bold mt-10 mb-4">
          Why Play This Game?
        </h2>
        <p className="leading-relaxed">
          This online undercover game is perfect for parties, college friends,
          and group fun. It improves communication skills, bluffing ability, and
          creates hilarious moments.
        </p>
      </section>
    </div>
  );
}
