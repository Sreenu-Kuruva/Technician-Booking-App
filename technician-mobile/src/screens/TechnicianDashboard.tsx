// src/screens/TechnicianDashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { BACKEND_URL } from '../constants/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TechnicianDashboard'>;

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    AsyncStorage.getItem('user').then(u => {
      if (u) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        axios.get(`${BACKEND_URL}/api/bookings/technician/${parsed._id}`).then(res => setBookings(res.data));
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
      <FlatList
        data={bookings}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>Date: {item.date}</Text>
            <Text>Slot: {item.timeSlot}</Text>
            <Text>User: {item.userId.username}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});