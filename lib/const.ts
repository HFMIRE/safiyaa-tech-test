import type { Cell, Winner } from "./interface";

export const DEFAULT_SIZE = 3;

export function createEmptyBoard(size: number): Cell[][] {
  return Array.from({ length: size }, () => Array<Cell>(size).fill(""));
}

export function checkWinner(board: Cell[][]): Winner {
  const size = board.length;

  if (size === 0) return null;


  for (let r = 0; r < size; r++) {
    const first = board[r][0];
    if (!first) continue;

    let allSame = true;
    for (let c = 1; c < size; c++) {
      if (board[r][c] !== first) {
        allSame = false;
        break;
      }
    }
    if (allSame) return first;
  }


  for (let c = 0; c < size; c++) {
    const first = board[0][c];
    if (!first) continue;

    let allSame = true;
    for (let r = 1; r < size; r++) {
      if (board[r][c] !== first) {
        allSame = false;
        break;
      }
    }
    if (allSame) return first;
  }

  {
    const first = board[0][0];
    if (first) {
      let allSame = true;
      for (let i = 1; i < size; i++) {
        if (board[i][i] !== first) {
          allSame = false;
          break;
        }
      }
      if (allSame) return first;
    }
  }
  {
    const first = board[0][size - 1];
    if (first) {
      let allSame = true;
      for (let i = 1; i < size; i++) {
        if (board[i][size - 1 - i] !== first) {
          allSame = false;
          break;
        }
      }
      if (allSame) return first;
    }
  }
  const hasEmpty = board.some((row) => row.some((cell) => cell === ""));
  if (!hasEmpty) return "draw";

  return null;
}
