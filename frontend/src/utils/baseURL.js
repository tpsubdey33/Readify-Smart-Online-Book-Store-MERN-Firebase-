// src/utils/baseURL.js
const getBaseUrl = () => {
  // In development, use your backend server URL
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000'; // or whatever port your backend runs on
  }
  // In production, use your deployed backend URL
  return import.meta.env.VITE_API_BASE_URL || '';
};

export default getBaseUrl;