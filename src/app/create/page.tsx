"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 14;

export default function CreateGamePage() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>(["", "", ""]);
  const [isLaunching, setIsLaunching] = useState(false);

  const updatePlayer = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    if (players.length < MAX_PLAYERS) {
      setPlayers([...players, ""]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > MIN_PLAYERS) {
      const updated = players.filter((_, i) => i !== index);
      setPlayers(updated);
    }
  };

  const validatePlayers = () => {
    const trimmed = players.map((p) => p.trim());

    if (trimmed.some((p) => p === "")) {
      alert("All player names must be filled.");
      return false;
    }

    const unique = new Set(trimmed);
    if (unique.size !== trimmed.length) {
      alert("Duplicate player names are not allowed.");
      return false;
    }

    return true;
  };

  const startGame = () => {
    if (!validatePlayers()) return;

    localStorage.setItem(
      "gamePlayers",
      JSON.stringify(players.map((p) => p.trim())),
    );

    setIsLaunching(true);

    setTimeout(() => {
      router.push("/setup");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex flex-col px-5 py-8">
      <div className="max-w-md w-full mx-auto flex flex-col flex-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-red-500 text-center mb-2">
          THE UNDERCOVER
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
          Enter the names. Trust no one.
        </p>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                placeholder={`Agent ${index + 1}`}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-red-500 focus:outline-none text-base"
              />

              {players.length > MIN_PLAYERS && (
                <button
                  onClick={() => removePlayer(index)}
                  className="px-4 py-3 bg-red-700 active:scale-95 rounded-xl transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {players.length < MAX_PLAYERS && (
            <button
              onClick={addPlayer}
              className="w-full py-3 bg-blue-700 active:scale-95 rounded-xl text-base font-medium transition"
            >
              + Add Agent
            </button>
          )}

          <button
            onClick={startGame}
            className="w-full py-4 bg-green-600 active:scale-95 rounded-xl text-lg font-bold transition"
          >
            INITIATE MISSION
          </button>
        </div>

        <p className="mt-6 text-gray-500 text-center text-xs">
          Agents: {players.length} | Min {MIN_PLAYERS} – Max {MAX_PLAYERS}
        </p>
      </div>

      {/* Cinematic Launch Overlay */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
          >
            <motion.h1
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl font-extrabold tracking-widest text-red-500"
            >
              MISSION INITIATED
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
