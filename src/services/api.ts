import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LeaderboardEntry } from '../types';

// Local storage-based services for offline chess game
export const authService = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const users = await getStoredUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = `token_${user.id}_${Date.now()}`;
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    await AsyncStorage.setItem('authToken', token);
    
    return { user, token };
  },
  
  register: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const users = await getStoredUsers();
    
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password, // In production, this should be hashed
      rating: 1500,
      wins: 0,
      losses: 0,
      draws: 0,
    };
    
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    
    const token = `token_${newUser.id}_${Date.now()}`;
    await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
    await AsyncStorage.setItem('authToken', token);
    
    return { user: newUser, token };
  },
};

export const gameService = {
  saveGame: async (gameData: any): Promise<void> => {
    const games = await getStoredGames();
    games.push({ ...gameData, id: Date.now().toString(), timestamp: Date.now() });
    await AsyncStorage.setItem('games', JSON.stringify(games));
  },
  
  updateRating: async (userId: string, newRating: number): Promise<void> => {
    const users = await getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].rating = newRating;
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  },
};

export const leaderboardService = {
  getLeaderboard: async (limit: number = 100): Promise<LeaderboardEntry[]> => {
    const users = await getStoredUsers();
    const sortedUsers = users
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    
    return sortedUsers.map((user, index) => ({
      rank: index + 1,
      user,
    }));
  },
};

// Helper functions
async function getStoredUsers(): Promise<User[]> {
  const stored = await AsyncStorage.getItem('users');
  return stored ? JSON.parse(stored) : [];
}

async function getStoredGames(): Promise<any[]> {
  const stored = await AsyncStorage.getItem('games');
  return stored ? JSON.parse(stored) : [];
}
