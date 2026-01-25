import { Board, Piece, Position, PieceColor, GameState } from '../types';

export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }
  
  // Rooks
  board[0][0] = board[0][7] = { type: 'rook', color: 'black' };
  board[7][0] = board[7][7] = { type: 'rook', color: 'white' };
  
  // Knights
  board[0][1] = board[0][6] = { type: 'knight', color: 'black' };
  board[7][1] = board[7][6] = { type: 'knight', color: 'white' };
  
  // Bishops
  board[0][2] = board[0][5] = { type: 'bishop', color: 'black' };
  board[7][2] = board[7][5] = { type: 'bishop', color: 'white' };
  
  // Queens
  board[0][3] = { type: 'queen', color: 'black' };
  board[7][3] = { type: 'queen', color: 'white' };
  
  // Kings
  board[0][4] = { type: 'king', color: 'black' };
  board[7][4] = { type: 'king', color: 'white' };
  
  return board;
};

export const isValidMove = (
  board: Board,
  from: Position,
  to: Position,
  piece: Piece
): boolean => {
  if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;
  
  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === piece.color) return false;
  
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(board, from, to, piece.color);
    case 'rook':
      return (rowDiff === 0 || colDiff === 0) && isPathClear(board, from, to);
    case 'knight':
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    case 'bishop':
      return rowDiff === colDiff && isPathClear(board, from, to);
    case 'queen':
      return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && isPathClear(board, from, to);
    case 'king':
      return rowDiff <= 1 && colDiff <= 1;
    default:
      return false;
  }
};

const isValidPawnMove = (board: Board, from: Position, to: Position, color: PieceColor): boolean => {
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  const rowDiff = to.row - from.row;
  const colDiff = Math.abs(to.col - from.col);
  
  if (colDiff === 0) {
    if (rowDiff === direction && !board[to.row][to.col]) return true;
    if (from.row === startRow && rowDiff === 2 * direction && !board[to.row][to.col] && !board[from.row + direction][from.col]) return true;
  } else if (colDiff === 1 && rowDiff === direction) {
    return !!board[to.row][to.col];
  }
  
  return false;
};

const isPathClear = (board: Board, from: Position, to: Position): boolean => {
  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);
  let row = from.row + rowStep;
  let col = from.col + colStep;
  
  while (row !== to.row || col !== to.col) {
    if (board[row][col]) return false;
    row += rowStep;
    col += colStep;
  }
  
  return true;
};

export const isKingInCheck = (board: Board, kingColor: PieceColor): boolean => {
  let kingPos: Position | null = null;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        if (isValidMove(board, { row, col }, kingPos, piece)) {
          return true;
        }
      }
    }
  }
  
  return false;
};
