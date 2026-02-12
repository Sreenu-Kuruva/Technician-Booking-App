// src/screens/CalendarScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../constants/api';

interface Slot {
  slot: string;
  available: boolean;
}

interface Technician {
  _id: string;
  username: string;
  category: string;
  slots: Slot[];
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [categories, setCategories] = useState<string[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]); // to enable cancel

  useEffect(() => {
    const loadData = async () => {
      const prefs = await AsyncStorage.getItem('preferences');
      const u = await AsyncStorage.getItem('user');
      if (prefs) setCategories(JSON.parse(prefs));
      if (u) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        // Fetch user's existing bookings to allow cancel
        const res = await axios.get(`${BACKEND_URL}/api/bookings/user/${parsed._id}`);
        setUserBookings(res.data);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) fetchAvailableSlots(selectedDate);
  }, [selectedDate, categories]);

  const fetchAvailableSlots = async (date: string) => {
    try {
      let allTechs: Technician[] = [];
      for (const cat of categories) {
        const res = await axios.get(`${BACKEND_URL}/api/bookings/technicians`, {
          params: { category: cat, date },
        });
        allTechs = [...allTechs, ...res.data];
      }
      setTechnicians(allTechs);
    } catch (err) {
      Alert.alert('Error', 'Failed to load slots');
    }
  };

  const bookSlot = async (technicianId: string, timeSlot: string, category: string) => {
    try {
      await axios.post(`${BACKEND_URL}/api/bookings/book`, {
        userId: user._id,
        technicianId,
        category,
        date: selectedDate,
        timeSlot,
      });
      Alert.alert('Success', 'Booked!');
      fetchAvailableSlots(selectedDate);
    } catch (err: any) {
      Alert.alert('Booking Failed', err.response?.data?.error || 'Try again');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await axios.put(`${BACKEND_URL}/api/bookings/cancel/${bookingId}`);
      Alert.alert('Success', 'Booking cancelled');
      fetchAvailableSlots(selectedDate);
    } catch (err) {
      Alert.alert('Error', 'Failed to cancel');
    }
  };

  const isMyBooking = (techId: string, slot: string) => {
    return userBookings.some(
      (b) => b.technicianId === techId && b.timeSlot === slot && b.date === selectedDate && b.status === 'booked'
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true } }}
        enableSwipeMonths
      />

      <FlatList
        data={technicians}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.username} ({item.category})</Text>
            {item.slots.map((s) => {
              const isBookedByMe = isMyBooking(item._id, s.slot);
              return (
                <View key={s.slot} style={styles.slotRow}>
                  <Text>{s.slot}</Text>
                  {s.available || isBookedByMe ? (
                    isBookedByMe ? (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          // Find booking ID - you may need to adjust based on your backend response
                          const booking = userBookings.find(
                            (b) => b.technicianId === item._id && b.timeSlot === s.slot && b.date === selectedDate
                          );
                          if (booking) cancelBooking(booking._id);
                        }}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => bookSlot(item._id, s.slot, item.category)}
                      >
                        <Text style={styles.bookText}>Book</Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <Text style={styles.booked}>Booked</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No available technicians</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { margin: 12, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  bookButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  bookText: { color: 'white', fontWeight: '600' },
  cancelButton: { backgroundColor: '#ff3b30', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  cancelText: { color: 'white', fontWeight: '600' },
  booked: { color: '#999', fontStyle: 'italic' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#888' },
});