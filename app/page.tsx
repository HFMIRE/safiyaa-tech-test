"use client";

import { useState } from "react";
import { Winner, Player, Cell } from "../lib/interface";
import { checkWinner, DEFAULT_SIZE } from "../lib/const";
import Link from "next/link";

function createEmptyBoard(DEFAULT_SIZE: number): Cell[][] {
  return Array.from({ length: DEFAULT_SIZE }, () => Array<Cell>(DEFAULT_SIZE).fill(""));
}

export default function Page() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [sizeInput, setSizeInput] = useState(DEFAULT_SIZE.toString());
  const [boardDEFAULT_SIZE, setBoardDEFAULT_SIZE] = useState<number>(DEFAULT_SIZE);
  const [board, setBoard] = useState<Cell[][]>(() =>
    createEmptyBoard(DEFAULT_SIZE)
  );
  const [winner, setWinner] = useState<Winner>(null);

  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  function handleClick(rowI: number, colI: number, cell: Cell) {
    if (winner) return;
    if (cell !== "") return;

    const copyBoard = board.map((row) => [...row]);
    copyBoard[rowI][colI] = currentPlayer;
    setBoard(copyBoard);

    const resultWinner = checkWinner(copyBoard);
    setWinner(resultWinner);

    if (!resultWinner) {
      setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    }
  }

  function clearGame() {
    setBoard(createEmptyBoard(boardDEFAULT_SIZE));
    setCurrentPlayer("X");
    setWinner(null);
    setPlayerName("");
    setScoreSaved(false);
  }

  function manageBoardDEFAULT_SIZE(value: number) {
    if (Number.isNaN(value)) return;
    if (value < 3 || value > 15) return;

    setBoardDEFAULT_SIZE(value);
    setBoard(createEmptyBoard(value));
    setCurrentPlayer("X");
    setWinner(null);
    setPlayerName("");
    setScoreSaved(false);
  }

  async function saveScore() {
    if (!winner || winner === "draw") return;
    if (!playerName.trim()) return;

    try {
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName.trim(),
          score: 1,
        }),
      });

      setScoreSaved(true);
    } catch (err) {
      console.error("Failed to save score", err);
    }
  }

  function displayWinner(winner: string) {
    return (
      <>
        {!winner && (
          <div className="font-bold text-lg">
            Current player: {currentPlayer}
          </div>
        )}

        {winner && winner !== "draw" && (
          <div className="font-bold text-lg">Winner: {winner}</div>
        )}

        {winner === "draw" && (
          <div className="font-bold text-lg">It&apos;s a draw!</div>
        )}
      </>
    )

  }
  return (

    <div className="flex mt-10 h-full">
      <div className="flex flex-col items-center gap-10 flex-1">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-slate-800">
          Tic Tac Toe
        </h1>
        <div className="flex gap-4 items-center w-min-full">
          <div className="flex  gap-4 items-center">
            <label className="font-medium text-heading">Board SIZE  (3–15):</label>
            <input
              type="number"
              className="font-medium text-heading border-2 px-2 py-1 rounded"
              min={3}
              max={15}
              value={boardDEFAULT_SIZE}
              onChange={(e) => manageBoardDEFAULT_SIZE(parseInt(e.target.value, 10))}
            />
          </div>


          <Link href="/leaderboard">
            <button className="px-4 py-2 border rounded">
              Go to Leaderboard
            </button>
          </Link>
          <button onClick={clearGame} className="px-4 py-2 border rounded">
            Clear game
          </button>
        </div>

     
<div className="flex flex-col items-center">


          {winner && displayWinner(winner)}
          {winner && winner !== "draw" && (
            <div className="flex flex-col items-center gap-3 mt-4 ">
              {!scoreSaved ? (
                <>
                  <p className="font-medium">
                    Enter your name for the leaderboard:
                  </p>
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Player name"
                  />
                  <button
                    onClick={saveScore}
                    disabled={!playerName.trim()}
                    className="px-4 py-4 border rounded hover:bg-slate-100 disabled:opacity-50"
                  >
                    Save score
                  </button>
                </>
              ) : (
                <div>

                  <p className="text-sm text-green-700">
                    Score saved. Check the leaderboard page.
                  </p>

                </div>

              )}
            </div>
          )}
</div>
          <div>
            {board.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="grid gap-0"
                style={{
                  gridTemplateColumns: `repeat(${boardDEFAULT_SIZE}, minmax(0, 1fr))`,
                }}
              >
                {row.map((cell, colIndex) => (
                  <button
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="w-12 h-12 border flex items-center justify-center text-xl"
                    onClick={() => handleClick(rowIndex, colIndex, cell)}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            ))}
          </div>
        
      </div>
    </div>
  );
}
