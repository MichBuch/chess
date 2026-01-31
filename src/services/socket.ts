import { Move, ChatMessage } from '../types';

// Mock socket service for local/offline play
class SocketService {
  private listeners: { [key: string]: Function[] } = {};

  connect(userId: string) {
    console.log('Mock socket connected for user:', userId);
  }

  disconnect() {
    console.log('Mock socket disconnected');
    this.listeners = {};
  }

  joinGame(gameId: string) {
    console.log('Joined game:', gameId);
  }

  leaveGame(gameId: string) {
    console.log('Left game:', gameId);
  }

  sendMove(gameId: string, move: Move) {
    // For local play, immediately trigger the move callback
    // This simulates receiving the move back for local multiplayer
    setTimeout(() => {
      this.emit('move', move);
    }, 100);
  }

  onMove(callback: (move: Move) => void) {
    this.on('move', callback);
  }

  sendChatMessage(gameId: string, message: string) {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'local_user',
      username: 'Player',
      message,
      timestamp: Date.now(),
    };
    
    // Simulate receiving the chat message
    setTimeout(() => {
      this.emit('chat_message', chatMessage);
    }, 100);
  }

  onChatMessage(callback: (message: ChatMessage) => void) {
    this.on('chat_message', callback);
  }

  removeAllListeners() {
    this.listeners = {};
  }

  // Helper methods for mock event system
  private on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export default new SocketService();
