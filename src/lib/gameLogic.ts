import { wordPairs } from "@/data/wordPairs";

export type Role = "civilian" | "undercover" | "mrWhite";

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string | null;
}

interface RoleHistory {
  [playerName: string]: {
    undercover: number;
    mrWhite: number;
  };
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomWordPair(): [string, string] {
  const categories = Object.keys(wordPairs);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];

  const pairs = wordPairs[randomCategory];
  return pairs[Math.floor(Math.random() * pairs.length)];
}

function getRoleHistory(): RoleHistory {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("roleHistory");
  return stored ? JSON.parse(stored) : {};
}

function saveRoleHistory(history: RoleHistory) {
  if (typeof window === "undefined") return;
  localStorage.setItem("roleHistory", JSON.stringify(history));
}

export function generateGame(
  playerNames: string[],
  undercoverCount: number,
  mrWhiteCount: number,
): Player[] {
  const totalPlayers = playerNames.length;

  if (totalPlayers < 3) {
    throw new Error("Minimum 3 players required.");
  }

  // 3 player auto rule
  if (totalPlayers === 3) {
    undercoverCount = Math.random() > 0.5 ? 1 : 0;
    mrWhiteCount = undercoverCount === 1 ? 0 : 1;
  }

  const history = getRoleHistory();

  const shuffled = shuffleArray(playerNames);

  const roles: Role[] = [];

  // build role array properly
  for (let i = 0; i < undercoverCount; i++) roles.push("undercover");
  for (let i = 0; i < mrWhiteCount; i++) roles.push("mrWhite");

  while (roles.length < totalPlayers) {
    roles.push("civilian");
  }

  const shuffledRoles = shuffleArray(roles);

  const [word1, word2] = getRandomWordPair();

  const players: Player[] = shuffled.map((name, index) => {
    const role = shuffledRoles[index];

    if (!history[name]) {
      history[name] = { undercover: 0, mrWhite: 0 };
    }

    if (role === "undercover") history[name].undercover += 1;
    if (role === "mrWhite") history[name].mrWhite += 1;

    let word: string | null = null;
    if (role === "civilian") word = word1;
    if (role === "undercover") word = word2;

    return {
      id: crypto.randomUUID(),
      name,
      role,
      word,
    };
  });

  saveRoleHistory(history);

  return players;
}
