"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>([]);
  const [undercover, setUndercover] = useState(1);
  const [mrWhite, setMrWhite] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("gamePlayers");
    if (!stored) {
      router.push("/create");
      return;
    }
    setPlayers(JSON.parse(stored));
  }, [router]);

  const totalPlayers = players.length;
  const civilians = totalPlayers - undercover - mrWhite;

  const increaseUndercover = () => {
    if (undercover + mrWhite < totalPlayers - 1) {
      setUndercover((prev) => prev + 1);
    }
  };

  const decreaseUndercover = () => {
    if (undercover > 0) {
      setUndercover((prev) => prev - 1);
    }
  };

  const increaseMrWhite = () => {
    if (undercover + mrWhite < totalPlayers - 1) {
      setMrWhite((prev) => prev + 1);
    }
  };

  const decreaseMrWhite = () => {
    if (mrWhite > 0) {
      setMrWhite((prev) => prev - 1);
    }
  };

  const startGame = () => {
    if (totalPlayers < 3) return;

    if (totalPlayers === 3) {
      localStorage.setItem(
        "roleConfig",
        JSON.stringify({
          undercover: Math.random() > 0.5 ? 1 : 0,
          mrWhite: 1,
        }),
      );
    } else {
      localStorage.setItem(
        "roleConfig",
        JSON.stringify({ undercover, mrWhite }),
      );
    }

    setIsLaunching(true);

    setTimeout(() => {
      router.push("/game");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex flex-col px-5 py-8">
      <div className="max-w-md w-full mx-auto flex flex-col flex-1">
        <h1 className="text-3xl font-extrabold text-center text-red-500 mb-6">
          ROLE CONFIGURATION
        </h1>

        {totalPlayers === 3 ? (
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-lg font-semibold">
              2 Civilians + 1 Special Role
            </p>
            <p className="text-gray-400 text-sm mt-2">
              (Random Undercover or Mr. White)
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Undercover Rocker */}
            <div className="flex items-center justify-between bg-gray-800 p-5 rounded-2xl">
              <span className="font-semibold">Undercover</span>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={increaseUndercover}
                  className="w-12 h-12 bg-red-600 rounded-full active:scale-90 text-xl"
                >
                  +
                </button>

                <motion.div
                  key={undercover}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {undercover}
                </motion.div>

                <button
                  onClick={decreaseUndercover}
                  className="w-12 h-12 bg-red-800 rounded-full active:scale-90 text-xl"
                >
                  −
                </button>
              </div>
            </div>

            {/* Mr White Rocker */}
            <div className="flex items-center justify-between bg-gray-800 p-5 rounded-2xl">
              <span className="font-semibold">Mr. White</span>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={increaseMrWhite}
                  className="w-12 h-12 bg-gray-500 rounded-full active:scale-90 text-xl"
                >
                  +
                </button>

                <motion.div
                  key={mrWhite}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {mrWhite}
                </motion.div>

                <button
                  onClick={decreaseMrWhite}
                  className="w-12 h-12 bg-gray-700 rounded-full active:scale-90 text-xl"
                >
                  −
                </button>
              </div>
            </div>

            {/* Civilians Display */}
            <div className="bg-gray-900 p-4 rounded-xl text-center">
              <p>Total Players: {totalPlayers}</p>
              <p className="text-green-400 font-bold">Civilians: {civilians}</p>
            </div>
          </div>
        )}

        <button
          onClick={startGame}
          className="mt-10 w-full py-4 bg-green-600 rounded-xl text-lg font-bold active:scale-95"
        >
          DEPLOY AGENTS
        </button>
      </div>

      {/* Cinematic Launch Overlay */}
      {/* Cinematic Launch Overlay */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-linear-to-br from-black via-red-950 to-black flex items-center justify-center z-50 overflow-hidden"
          >
            {/* Pulsing background glow */}
            <motion.div
              className="absolute w-100 h-100 rounded-full bg-red-600 blur-3xl opacity-30"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Text */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative text-center"
            >
              <h1 className="text-5xl font-extrabold tracking-widest text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]">
                DEPLOYING
              </h1>

              <motion.div
                className="mt-4 h-1 w-40 bg-red-500 mx-auto rounded-full"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
