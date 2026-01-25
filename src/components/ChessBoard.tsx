import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Board, Position, Piece } from '../types';

interface ChessBoardProps {
  board: Board;
  onMove: (from: Position, to: Position) => void;
  playerColor: 'white' | 'black';
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, onMove, playerColor }) => {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);

  const handleSquarePress = (row: number, col: number) => {
    if (selectedSquare) {
      onMove(selectedSquare, { row, col });
      setSelectedSquare(null);
    } else {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const getPieceSymbol = (piece: Piece | null): string => {
    if (!piece) return '';
    const symbols: { [key: string]: { white: string; black: string } } = {
      king: { white: '♔', black: '♚' },
      queen: { white: '♕', black: '♛' },
      rook: { white: '♖', black: '♜' },
      bishop: { white: '♗', black: '♝' },
      knight: { white: '♘', black: '♞' },
      pawn: { white: '♙', black: '♟' },
    };
    return symbols[piece.type][piece.color];
  };

  const displayBoard = playerColor === 'white' ? board : [...board].reverse();

  return (
    <View style={styles.board}>
      {displayBoard.map((row, rowIndex) => {
        const actualRow = playerColor === 'white' ? rowIndex : 7 - rowIndex;
        return (
          <View key={rowIndex} style={styles.row}>
            {row.map((piece, colIndex) => {
              const actualCol = playerColor === 'white' ? colIndex : 7 - colIndex;
              const isLight = (actualRow + actualCol) % 2 === 0;
              const isSelected = selectedSquare?.row === actualRow && selectedSquare?.col === actualCol;
              
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.square,
                    isLight ? styles.lightSquare : styles.darkSquare,
                    isSelected && styles.selectedSquare,
                  ]}
                  onPress={() => handleSquarePress(actualRow, actualCol)}
                >
                  <Text style={styles.piece}>{getPieceSymbol(piece)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    aspectRatio: 1,
    width: '100%',
    maxWidth: 400,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightSquare: {
    backgroundColor: '#f0d9b5',
  },
  darkSquare: {
    backgroundColor: '#b58863',
  },
  selectedSquare: {
    backgroundColor: '#7fc97f',
  },
  piece: {
    fontSize: 36,
  },
});

export default ChessBoard;
