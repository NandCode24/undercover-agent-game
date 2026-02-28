export type Role = "civilian" | "undercover" | "mrWhite";

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string | null;
}
