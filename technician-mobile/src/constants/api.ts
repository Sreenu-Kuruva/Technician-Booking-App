// src/constants/api.ts

// CHANGE THIS LINE to your computer's real IP address
// Find it: open Command Prompt → type "ipconfig" → look for IPv4 Address (usually 192.168.1.xxx)
export const BACKEND_URL = 'http://11.555.55:5000';

// For production later (when you host backend online)
export const PROD_URL = 'https://your-backend-domain.com';

// Optional: automatic switch in development vs production
export const API_BASE = __DEV__ ? BACKEND_URL : PROD_URL;