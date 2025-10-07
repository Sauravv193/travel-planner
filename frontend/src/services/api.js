import axios from 'axios';
import { getToken } from './storage';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        // For public endpoints (signin, signup), allow requests without token
        if (config.url.includes('/auth/')) {
          return config;
        }
        return Promise.reject(new Error("Authentication required"));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.config?.url, error.response?.status);
    }
    return Promise.reject(error);
  }
);

// ... the rest of your api.js file remains the same

export const signUp = (username, email, password) => {
  return api.post('/auth/signup', { username, email, password });
};

export const signIn = (username, password) => {
  return api.post('/auth/signin', { username, password });
};

export const getUserProfile = () => {
  return api.get('/user/profile');
};

export const updateUserProfile = (userData) => {
  return api.put('/user/profile', userData);
};

export const getTrips = () => {
  return api.get('/trips');
};

export const getTripById = (tripId) => {
  return api.get(`/trips/${tripId}`);
};

export const createTrip = (tripData) => {
  return api.post('/trips', tripData);
};

export const updateTrip = (tripId, tripData) => {
  return api.put(`/trips/${tripId}`, tripData);
};

export const deleteTrip = (tripId) => {
  return api.delete(`/trips/${tripId}`);
};

export const generateItinerary = (tripId) => {
  return api.post(`/itineraries/generate/${tripId}`);
};

export const regenerateItinerary = (tripId) => {
  return api.put(`/itineraries/regenerate/${tripId}`);
};

export const adaptItinerary = (tripId, adaptationData) => {
  return api.post(`/itineraries/adapt/${tripId}`, adaptationData);
};

export const getJournal = (tripId) => {
  return api.get(`/journal/${tripId}`);
};

export const saveJournal = (tripId, journalData) => {
  return api.post(`/journal/${tripId}`, journalData);
};

export const deleteJournal = (tripId) => {
  return api.delete(`/journal/${tripId}`);
};


export default api;