import axios from 'axios';
import { getToken, getRefreshToken, saveToken, saveRefreshToken, removeToken } from './storage';

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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're already refreshing to avoid infinite loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for error handling with auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry refresh/auth endpoints to avoid loops
    if (originalRequest.url?.includes('/auth/refreshtoken') || 
        originalRequest.url?.includes('/auth/signin') ||
        originalRequest.url?.includes('/auth/signup')) {
      return Promise.reject(error);
    }
    
    // Handle 401 - Token expired, try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshTokenValue = getRefreshToken();
      
      if (!refreshTokenValue) {
        // No refresh token available, clear auth state
        if (window.location.pathname !== '/signin') {
          removeToken();
          window.location.replace('/signin');
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/v1/auth/refreshtoken`, {
          refreshToken: refreshTokenValue
        });
        
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        saveToken(newToken);
        if (newRefreshToken) {
          saveRefreshToken(newRefreshToken);
        }
        
        processQueue(null, newToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeToken();
        if (window.location.pathname !== '/signin') {
          window.location.replace('/signin');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle 429 - Rate limited
    if (error.response?.status === 429) {
      console.warn('Rate limited. Please slow down your requests.');
      // Could add custom notification logic here
    }
    
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

export const forgotPassword = (email) => {
  return api.post('/v1/auth/forgot-password', { email });
};

export const resetPassword = (token, password) => {
  return api.post('/v1/auth/reset-password', { token, password });
};

export const verifyEmail = (token) => {
  return api.post(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`);
};

export const resendVerificationEmail = () => {
  return api.post('/v1/auth/resend-verification');
};

export const refreshAuthToken = (refreshTokenValue) => {
  return api.post('/v1/auth/refreshtoken', { refreshToken: refreshTokenValue });
};

// Job API (for polling async operations)
export const getJobStatus = (jobId) => {
  return api.get(`/v1/jobs/${jobId}`);
};

// Conversation API
export const createConversation = (tripId) => {
  return api.post('/v1/conversations', { tripId });
};

export const sendMessage = (conversationId, content) => {
  return api.post(`/v1/conversations/${conversationId}/message`, { content });
};

export const getConversation = (conversationId) => {
  return api.get(`/v1/conversations/${conversationId}`);
};

export const getTripConversations = (tripId) => {
  return api.get(`/v1/conversations/trip/${tripId}`);
};

export const deleteConversation = (conversationId) => {
  return api.delete(`/v1/conversations/${conversationId}`);
};

export default api;
