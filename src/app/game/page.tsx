"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateGame, Player as BasePlayer } from "@/lib/gameLogic";

type Phase =
  | "loading"
  | "reveal"
  | "discussion"
  | "voting"
  | "revealRole"
  | "mrWhiteFail"
  | "final";

interface Player extends BasePlayer {
  eliminated: boolean;
  points: number;
}

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [players, setPlayers] = useState<Player[]>([]);
  const [discussionOrder, setDiscussionOrder] = useState<Player[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [lastEliminated, setLastEliminated] = useState<Player | null>(null);
  const [winner, setWinner] = useState("");

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const storedPlayers = localStorage.getItem("gamePlayers");
    const roleConfig = localStorage.getItem("roleConfig");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "{}");

    if (!storedPlayers || !roleConfig) {
      window.location.href = "/create";
      return;
    }

    const names: string[] = JSON.parse(storedPlayers);
    const { undercover, mrWhite } = JSON.parse(roleConfig);

    const basePlayers = generateGame(names, undercover, mrWhite);

    const enriched = basePlayers.map((p) => ({
      ...p,
      eliminated: false,
      points: leaderboard[p.name] || 0,
    }));

    setPlayers(enriched);
    setPhase("reveal");
  }, []);

  const activePlayers = players.filter((p) => !p.eliminated);

  const reshuffleDiscussion = (activeList: Player[]) => {
    const shuffled = [...activeList].sort(() => Math.random() - 0.5);
    const mrWhiteIndex = shuffled.findIndex((p) => p.role === "mrWhite");

    if (mrWhiteIndex !== -1 && mrWhiteIndex < 2) {
      const mrWhite = shuffled.splice(mrWhiteIndex, 1)[0];
      const insertPos = Math.floor(Math.random() * (shuffled.length - 2)) + 2;
      shuffled.splice(insertPos, 0, mrWhite);
    }

    setDiscussionOrder(shuffled);
  };

  const nextReveal = () => {
    setFlipped(false);
    if (currentRevealIndex < players.length - 1) {
      setCurrentRevealIndex((prev) => prev + 1);
    } else {
      reshuffleDiscussion(activePlayers);
      setPhase("discussion");
    }
  };

  const checkWin = (updatedPlayers: Player[]) => {
    const active = updatedPlayers.filter((p) => !p.eliminated);
    const civiliansAlive = active.filter((p) => p.role === "civilian").length;
    const undercoverAlive = active.filter(
      (p) => p.role === "undercover",
    ).length;
    const mrWhiteAlive = active.filter((p) => p.role === "mrWhite").length;

    if (undercoverAlive === 0 && mrWhiteAlive === 0) {
      finalizeGame(updatedPlayers, "CIVILIANS WIN", false);
      return;
    }

    if (civiliansAlive <= 1 && (undercoverAlive > 0 || mrWhiteAlive > 0)) {
      finalizeGame(updatedPlayers, "SPECIAL ROLES WIN", true);
      return;
    }

    reshuffleDiscussion(active);
    setPhase("discussion");
  };

  const finalizeGame = (
    updatedPlayers: Player[],
    message: string,
    specialWin: boolean,
  ) => {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "{}");

    updatedPlayers = updatedPlayers.map((p) => {
      if (
        (!specialWin && p.role === "civilian" && !p.eliminated) ||
        (specialWin &&
          (p.role === "undercover" || p.role === "mrWhite") &&
          !p.eliminated)
      ) {
        const inc = specialWin ? 6 : 2;
        leaderboard[p.name] = (leaderboard[p.name] || 0) + inc;
        return { ...p, points: leaderboard[p.name] };
      }
      return p;
    });

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    if (specialWin) {
      playSound("/sounds/special-win.mp3");
    } else {
      playSound("/sounds/civilian-win.mp3");
    }

    setPlayers(updatedPlayers);
    setWinner(message);
    setPhase("final");
  };

  const handleVote = () => {
    if (!selectedVote) return;

    const voted = players.find((p) => p.id === selectedVote);
    if (!voted) return;

    if (voted.role === "mrWhite") {
      const civilianWord = players.find((p) => p.role === "civilian")?.word;
      const guess = prompt("Mr White, what is the civilian word?");

      if (
        guess &&
        civilianWord &&
        guess.trim().toLowerCase() === civilianWord.trim().toLowerCase()
      ) {
        finalizeGame(players, "MR WHITE OUTSMARTED EVERYONE!", true);
        return;
      } else {
        playSound("/sounds/special-caught.mp3");
        setLastEliminated(voted);
        setPhase("mrWhiteFail");
        return;
      }
    }

    const updated = players.map((p) =>
      p.id === voted.id ? { ...p, eliminated: true } : p,
    );

    if (voted.role === "civilian") {
      playSound("/sounds/civilian-out.mp3");
    } else {
      playSound("/sounds/special-caught.mp3");
    }

    setPlayers(updated);
    setLastEliminated(voted);
    setSelectedVote(null);
    setPhase("revealRole");
  };

  // 🔄 REMATCH (ADDED — no logic changed)
  const handleRematch = () => {
    const roleConfig = localStorage.getItem("roleConfig");
    if (!roleConfig) return;

    const { undercover, mrWhite } = JSON.parse(roleConfig);
    const names = players.map((p) => p.name);
    const newBase = generateGame(names, undercover, mrWhite);
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "{}");

    const refreshed = newBase.map((p) => ({
      ...p,
      eliminated: false,
      points: leaderboard[p.name] || 0,
    }));

    setPlayers(refreshed);
    setCurrentRevealIndex(0);
    setSelectedVote(null);
    setLastEliminated(null);
    setWinner("");
    setFlipped(false);
    setDiscussionOrder([]);
    setPhase("reveal");
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Initializing Mission...
      </div>
    );
  }

  if (phase === "reveal") {
    const player = players[currentRevealIndex];
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="mb-6 text-xl">{player.name}</h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-80 h-48 rounded-2xl bg-gray-800 shadow-2xl flex items-center justify-center cursor-pointer border border-gray-600"
          onClick={() => setFlipped(true)}
        >
          {!flipped ? (
            <span className="text-gray-400 animate-pulse">TAP TO REVEAL</span>
          ) : player.role === "mrWhite" ? (
            <span className="text-2xl text-purple-400 font-bold">
              You are Mr. White
            </span>
          ) : (
            <span className="text-4xl font-extrabold text-cyan-400">
              {player.word}
            </span>
          )}
        </motion.div>

        {flipped && (
          <button
            onClick={nextReveal}
            className="mt-8 px-6 py-3 bg-green-600 rounded-xl"
          >
            Next Player
          </button>
        )}
      </div>
    );
  }

  if (phase === "discussion") {
    return (
      <div className="min-h-screen bg-black text-white p-6 text-center">
        <h2 className="text-2xl mb-6">Discussion Order</h2>
        {discussionOrder.map((p, i) => (
          <div key={p.id} className="mb-3 bg-gray-800 p-3 rounded-xl">
            {i + 1}. {p.name}
          </div>
        ))}
        <button
          onClick={() => setPhase("voting")}
          className="mt-6 px-6 py-3 bg-green-600 rounded-xl"
        >
          Start Voting
        </button>
      </div>
    );
  }

  if (phase === "voting") {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <h2 className="text-2xl mb-6 text-center">Vote the Suspect</h2>
        {players.map((p) => (
          <div
            key={p.id}
            className={`p-4 mb-3 rounded-xl cursor-pointer ${
              p.eliminated
                ? "bg-gray-900 opacity-40"
                : selectedVote === p.id
                  ? "bg-red-600"
                  : "bg-gray-800"
            }`}
            onClick={() => !p.eliminated && setSelectedVote(p.id)}
          >
            {p.name}
          </div>
        ))}
        <button
          onClick={handleVote}
          className="mt-6 w-full py-3 bg-green-600 rounded"
        >
          Confirm Vote
        </button>
      </div>
    );
  }

  if (phase === "revealRole" && lastEliminated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl mb-6">
          {lastEliminated.name} was {lastEliminated.role}
        </h2>
        <button
          onClick={() => checkWin(players)}
          className="px-6 py-3 bg-blue-600 rounded-xl"
        >
          Continue
        </button>
      </div>
    );
  }

  if (phase === "mrWhiteFail" && lastEliminated) {
    const updated = players.map((p) =>
      p.id === lastEliminated.id ? { ...p, eliminated: true } : p,
    );

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl text-red-500 mb-6">
          Mr White Failed the Mission
        </h2>
        <button
          onClick={() => {
            setPlayers(updated);
            checkWin(updated);
          }}
          className="px-6 py-3 bg-blue-600 rounded-xl"
        >
          Continue
        </button>
      </div>
    );
  }

  // FINAL SCREEN WITH REMATCH BUTTON
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-yellow-400 mb-12 text-center"
      >
        {winner}
      </motion.h1>

      <div className="w-full max-w-md space-y-4">
        {players
          .sort((a, b) => b.points - a.points)
          .map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-gray-800 px-6 py-4 rounded-2xl flex justify-between items-center"
            >
              <div>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-sm text-gray-400 capitalize">
                  {p.role === "mrWhite" ? "Mr. White" : p.role}
                </div>
              </div>
              <div className="text-cyan-400 font-bold text-xl">
                {p.points} pts
              </div>
            </motion.div>
          ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRematch}
        className="mt-12 px-10 py-4 text-lg font-bold rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 shadow-xl hover:shadow-cyan-400/60 transition-all duration-300"
      >
        🔄 Rematch
      </motion.button>
    </div>
  );
}
