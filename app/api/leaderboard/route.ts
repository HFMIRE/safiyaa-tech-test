import { NextResponse } from "next/server";
import db, { LeaderboardRow } from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare<unknown[], LeaderboardRow>(`
      SELECT id, name, score, created_at
      FROM leaderboard
      ORDER BY score DESC, created_at ASC
      LIMIT 20
    `)
    .all();

  return NextResponse.json(rows);
}

type PostBody = {
  name: string;
  score?: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as PostBody | null;

  if (!body || typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const name = body.name.trim().slice(0, 32);
  const score = typeof body.score === "number" ? body.score : 1;

  const insert = db.prepare(`
    INSERT INTO leaderboard (name, score)
    VALUES (?, ?)
  `);

  const info = insert.run(name, score);

  const row = db
    .prepare<unknown[], LeaderboardRow>(`
      SELECT id, name, score, created_at
      FROM leaderboard
      WHERE id = ?
    `)
    .get(info.lastInsertRowid);

  return NextResponse.json(row, { status: 201 });
}
