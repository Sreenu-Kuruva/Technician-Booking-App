// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { BACKEND_URL } from '../constants/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [category, setCategory] = useState('Cat 1');

  const navigation = useNavigation<NavigationProp>();

  const register = async () => {
    try {
      const body = { username, email, password, role, category: role === 'technician' ? category : undefined };
      await axios.post(`${BACKEND_URL}/api/auth/register`, body);
      Alert.alert('Success', 'Registered! Please login.');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Technician" value="technician" />
      </Picker>
      {role === 'technician' && (
        <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
          <Picker.Item label="Cat 1" value="Cat 1" />
          <Picker.Item label="Cat 2" value="Cat 2" />
          <Picker.Item label="Cat 3" value="Cat 3" />
        </Picker>
      )}
      <Button title="Register" onPress={register} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
  picker: { height: 50, width: '100%' },
});