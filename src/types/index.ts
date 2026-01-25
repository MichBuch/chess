export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  timestamp: number;
}

export interface GameState {
  board: Board;
  currentTurn: PieceColor;
  moves: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
}

export interface User {
  id: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
}
