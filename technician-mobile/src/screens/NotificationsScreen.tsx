// src/screens/NotificationsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../constants/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(u => {
      if (u) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        axios.get(`${BACKEND_URL}/api/notifications/${parsed._id}`).then(res => setNotifications(res.data));
      }
    });
  }, []);

  const markRead = async (id: string) => {
    await axios.put(`${BACKEND_URL}/api/notifications/${id}/read`);
    // Refresh
    AsyncStorage.getItem('user').then(u => {
      if (u) {
        const parsed = JSON.parse(u);
        axios.get(`${BACKEND_URL}/api/notifications/${parsed._id}`).then(res => setNotifications(res.data));
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.message}</Text>
            {!item.read && <Button title="Mark Read" onPress={() => markRead(item._id)} />}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});