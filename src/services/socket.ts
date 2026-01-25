import io, { Socket } from 'socket.io-client';
import { Move, ChatMessage } from '../types';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    this.socket = io(SOCKET_URL, {
      query: { userId },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinGame(gameId: string) {
    this.socket?.emit('join_game', { gameId });
  }

  leaveGame(gameId: string) {
    this.socket?.emit('leave_game', { gameId });
  }

  sendMove(gameId: string, move: Move) {
    this.socket?.emit('move', { gameId, move });
  }

  onMove(callback: (move: Move) => void) {
    this.socket?.on('move', callback);
  }

  sendChatMessage(gameId: string, message: string) {
    this.socket?.emit('chat_message', { gameId, message });
  }

  onChatMessage(callback: (message: ChatMessage) => void) {
    this.socket?.on('chat_message', callback);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
