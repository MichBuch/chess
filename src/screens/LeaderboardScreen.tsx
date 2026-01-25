import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { leaderboardService } from '../services/api';
import { LeaderboardEntry } from '../types';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardService.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.user.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.username}>{item.user.username}</Text>
            <Text style={styles.rating}>{item.user.rating}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 },
  rank: { width: 40, fontWeight: 'bold' },
  username: { flex: 1 },
  rating: { fontWeight: 'bold', color: '#007AFF' },
});

export default LeaderboardScreen;
