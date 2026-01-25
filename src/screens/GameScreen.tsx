import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import ChessBoard from '../components/ChessBoard';
import ChatPanel from '../components/ChatPanel';
import { createInitialBoard, isValidMove, isKingInCheck } from '../utils/chessLogic';
import { createSnapshot, exportSnapshot } from '../utils/boardSnapshot';
import { GameState, Position, ChatMessage } from '../types';
import socketService from '../services/socket';

const GameScreen = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentTurn: 'white',
    moves: [],
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [playerColor] = useState<'white' | 'black'>('white');

  useEffect(() => {
    socketService.connect('user123');
    socketService.joinGame('game123');
    
    socketService.onMove((move) => {
      handleOpponentMove(move);
    });
    
    socketService.onChatMessage((message) => {
      setChatMessages((prev) => [...prev, message]);
    });
    
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  const handleMove = (from: Position, to: Position) => {
    const piece = gameState.board[from.row][from.col];
    if (!piece || piece.color !== gameState.currentTurn) return;
    
    if (!isValidMove(gameState.board, from, to, piece)) return;
    
    const newBoard = gameState.board.map(row => [...row]);
    const captured = newBoard[to.row][to.col];
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
    
    const move = { from, to, piece, captured: captured || undefined, timestamp: Date.now() };
    
    setGameState({
      ...gameState,
      board: newBoard,
      currentTurn: gameState.currentTurn === 'white' ? 'black' : 'white',
      moves: [...gameState.moves, move],
      isCheck: isKingInCheck(newBoard, gameState.currentTurn === 'white' ? 'black' : 'white'),
    });
    
    socketService.sendMove('game123', move);
  };

  const handleOpponentMove = (move: any) => {
    // Handle opponent's move
  };

  const handleSnapshot = async () => {
    const snapshot = createSnapshot(gameState);
    await exportSnapshot(snapshot);
    Alert.alert('Success', 'Board snapshot exported');
  };

  const handleSendMessage = (message: string) => {
    socketService.sendChatMessage('game123', message);
  };

  return (
    <View style={styles.container}>
      <View style={styles.gameContainer}>
        <ChessBoard
          board={gameState.board}
          onMove={handleMove}
          playerColor={playerColor}
        />
        <TouchableOpacity style={styles.snapshotButton} onPress={handleSnapshot}>
          <Text style={styles.buttonText}>Export Snapshot</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chatContainer}>
        <ChatPanel messages={chatMessages} onSendMessage={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  gameContainer: { flex: 2, padding: 20, justifyContent: 'center', alignItems: 'center' },
  chatContainer: { flex: 1, borderLeftWidth: 1, borderLeftColor: '#ddd' },
  snapshotButton: { marginTop: 20, backgroundColor: '#28a745', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default GameScreen;
