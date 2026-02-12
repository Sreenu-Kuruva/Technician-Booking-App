# Technician Booking App

A full-stack mobile application that allows **users** to book technicians from predefined categories (Cat 1, Cat 2, Cat 3) and enables **technicians** to manage their bookings and receive notifications.

**Frontend**: React Native (Expo) + TypeScript  
**Backend**: Node.js (Express) + MongoDB  
**Platforms**: Android & iOS

## Features

### User Features
- Register / Login
- Select preferred technician categories (Cat 1, Cat 2, Cat 3)
- View weekly calendar with available time slots (filtered by selected categories)
- Book a time slot
- Cancel booked slots

### Technician Features
- View all booked time slots
- See customer details (username & email) for each booking
- Receive simple in-app notifications when a new booking is made
- Unread notification badge count

### Core Rules Implemented
- One booking per time slot (enforced by backend)
- Category-based filtering
- Weekly calendar navigation with swipe support

## Tech Stack

### Frontend (Expo)
- React Native + Expo (managed workflow)
- TypeScript
- React Navigation (stack navigator)
- Expo Go for instant testing on real devices
- Axios for API calls
- AsyncStorage for storing user data & preferences
- react-native-calendars for calendar UI
- Native styling with StyleSheet

### Backend (separate repo/folder)
- Node.js + Express
- MongoDB + Mongoose
- REST API endpoints for authentication, bookings & notifications


## How to Run (Development)

### Prerequisites
- Node.js 18+ / 20+
- Yarn or npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (Android/iOS)

### Steps

1. Clone the repo
   ```bash
   git clone https://github.com/Sreenu-Kuruva/Technician-Booking-App.git
   cd Technician-Booking-App

2.Install dependencies
  npm i

3.Update backend URL
  Open src/constants/api.ts
  Change BACKEND_URL to your backend server's IP/port (e.g. http://192.168.1.100:5000)
  Use your computer's local IP (run ipconfig on Windows)

4.Start the app
  npx expo start -c

5.Backend
  cd backend
  npm i
  npm start

6.How to Build APK / AAB

 Install EAS CLIBashnpm install -g eas-cli
 Login to Expo accountBasheas login
 Build APK (for testing)Basheas build --platform android --profile preview
 Build AAB (for Google Play Store)Basheas build --platform android --profile production
