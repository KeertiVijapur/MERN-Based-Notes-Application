// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your API base URL
});

// Automatically attach token from localStorage/sessionStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // ✅ Matches Login.jsx
console.log("📦 Token from localStorage:", token);
    if (token) {
     config.headers.Authorization = `Bearer ${token}`;
      console.log('🛡 Token attached:', token); // Just for dev
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
