// src/screens/PreferencesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const categories = ['Cat 1', 'Cat 2', 'Cat 3'];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preferences'>;

export default function PreferencesScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    AsyncStorage.getItem('preferences').then(prefs => {
      if (prefs) setSelectedCategories(JSON.parse(prefs));
    });
  }, []);

  const toggle = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const save = async () => {
    await AsyncStorage.setItem('preferences', JSON.stringify(selectedCategories));
    navigation.navigate('Calendar');
  };

  return (
    <View style={styles.container}>
      <Text>Select Categories:</Text>
      {categories.map(cat => (
        <View key={cat} style={styles.row}>
          <Text>{cat}</Text>
          <Switch value={selectedCategories.includes(cat)} onValueChange={() => toggle(cat)} />
        </View>
      ))}
      <Button title="Save" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});