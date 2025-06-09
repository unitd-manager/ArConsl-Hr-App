import axios from 'axios';
import { Alert } from 'react-native';

const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 seconds

const api = axios.create({
  baseURL: 'https://arconsultancy.unitdtechnologies.com:2038',
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if we should retry the request
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      if (originalRequest._retry <= MAX_RETRIES) {
        return api(originalRequest);
      }
    }

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      Alert.alert('Connection Timeout', 'The server is taking too long to respond. Please check your internet connection and try again.');
    } else if (!error.response) {
      Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection and try again.');
    } else {
      switch (error.response.status) {
        case 404:
          Alert.alert('Error', 'The requested resource was not found.');
          break;
        case 500:
          Alert.alert('Server Error', 'Something went wrong on our servers. Please try again later.');
          break;
        default:
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;