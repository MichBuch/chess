import { Board, GameState } from '../types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface BoardSnapshot {
  board: Board;
  fen: string;
  timestamp: number;
  moveNumber: number;
}

export const boardToFEN = (board: Board, currentTurn: 'white' | 'black'): string => {
  let fen = '';
  
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        const pieceChar = getPieceChar(piece.type);
        fen += piece.color === 'white' ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
      }
    }
    if (emptyCount > 0) fen += emptyCount;
    if (row < 7) fen += '/';
  }
  
  fen += ` ${currentTurn === 'white' ? 'w' : 'b'} KQkq - 0 1`;
  return fen;
};

const getPieceChar = (type: string): string => {
  const map: { [key: string]: string } = {
    pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k'
  };
  return map[type] || '';
};

export const createSnapshot = (gameState: GameState): BoardSnapshot => {
  return {
    board: JSON.parse(JSON.stringify(gameState.board)),
    fen: boardToFEN(gameState.board, gameState.currentTurn),
    timestamp: Date.now(),
    moveNumber: gameState.moves.length
  };
};

export const exportSnapshot = async (snapshot: BoardSnapshot): Promise<void> => {
  const data = JSON.stringify(snapshot, null, 2);
  const fileUri = FileSystem.documentDirectory + `chess_snapshot_${snapshot.timestamp}.json`;
  
  await FileSystem.writeAsStringAsync(fileUri, data);
  
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
};

export const exportAllSnapshots = async (snapshots: BoardSnapshot[]): Promise<void> => {
  const data = JSON.stringify(snapshots, null, 2);
  const fileUri = FileSystem.documentDirectory + `chess_snapshots_${Date.now()}.json`;
  
  await FileSystem.writeAsStringAsync(fileUri, data);
  
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
};
