import Database from "better-sqlite3";

const db = new Database("leaderboard.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export type LeaderboardRow = {
  id: number;
  name: string;
  score: number;
  created_at: string;
};

export default db;