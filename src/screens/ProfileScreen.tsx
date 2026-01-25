import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Username: Player1</Text>
      <Text style={styles.label}>Rating: 1500</Text>
      <Text style={styles.label}>Wins: 10</Text>
      <Text style={styles.label}>Losses: 5</Text>
      <Text style={styles.label}>Draws: 2</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 10 },
});

export default ProfileScreen;
