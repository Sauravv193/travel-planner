import axios from 'axios';
import { getToken } from './storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Always allow requests - let the server handle authentication
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
  return api.post('/v1/auth/signup', { username, email, password });
};

export const signIn = (username, password) => {
  return api.post('/v1/auth/signin', { username, password });
};

export const getUserProfile = () => {
  return api.get('/v1/user/profile');
};

export const updateUserProfile = (userData) => {
  return api.put('/v1/user/profile', userData);
};

export const getTrips = () => {
  return api.get('/v1/trips');
};

export const getTripById = (tripId) => {
  return api.get(`/v1/trips/${tripId}`);
};

export const createTrip = (tripData) => {
  return api.post('/v1/trips', tripData);
};

export const updateTrip = (tripId, tripData) => {
  return api.put(`/v1/trips/${tripId}`, tripData);
};

export const deleteTrip = (tripId) => {
  return api.delete(`/v1/trips/${tripId}`);
};

export const generateItinerary = (tripId) => {
  return api.post(`/v1/itineraries/generate/${tripId}`);
};

export const regenerateItinerary = (tripId) => {
  return api.put(`/v1/itineraries/regenerate/${tripId}`);
};

export const adaptItinerary = (tripId, adaptationData) => {
  return api.post(`/v1/itineraries/adapt/${tripId}`, adaptationData);
};

export const getJournal = (tripId) => {
  return api.get(`/v1/journal/${tripId}`);
};

export const saveJournal = (tripId, journalData) => {
  return api.post(`/v1/journal/${tripId}`, journalData);
};

export const deleteJournal = (tripId) => {
  return api.delete(`/v1/journal/${tripId}`);
};

export const generateJournal = (tripId) => {
  return api.post(`/v1/journal/generate/${tripId}`);
};

// Photo Management APIs
export const uploadPhotos = (tripId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  return api.post(`/v1/photos/upload/${tripId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getPhotosForTrip = (tripId) => {
  return api.get(`/v1/photos/trip/${tripId}`);
};

export const deletePhoto = (photoId) => {
  return api.delete(`/v1/photos/${photoId}`);
};

export const getPhotoUrl = (photoId) => {
  const token = getToken();
  if (token) {
    return `${API_URL}/v1/photos/serve/${photoId}?token=${encodeURIComponent(token)}`;
  }
  return `${API_URL}/v1/photos/serve/${photoId}`;
};

export const fetchPhotoBlob = async (photoId) => {
  try {
    const response = await api.get(`/v1/photos/serve/${photoId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Failed to fetch photo:', error);
    throw error;
  }
};

export default api;
