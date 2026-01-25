import axios from 'axios';
import { User, LeaderboardEntry } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
};

export const gameService = {
  saveGame: async (gameData: any): Promise<void> => {
    await api.post('/games', gameData);
  },
  
  updateRating: async (userId: string, newRating: number): Promise<void> => {
    await api.patch(`/users/${userId}/rating`, { rating: newRating });
  },
};

export const leaderboardService = {
  getLeaderboard: async (limit: number = 100): Promise<LeaderboardEntry[]> => {
    const response = await api.get(`/leaderboard?limit=${limit}`);
    return response.data;
  },
};

export const chatService = {
  sendMessage: async (gameId: string, message: string): Promise<void> => {
    await api.post(`/games/${gameId}/chat`, { message });
  },
};
