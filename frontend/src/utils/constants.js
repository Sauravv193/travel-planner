// API Keys and other constants
// I've inserted the key you provided.
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Application constants
export const APP_NAME = 'WanderGen';
export const APP_VERSION = '2.0';

// API endpoints
export const API_ENDPOINTS = {
  GENERATE_ITINERARY: '/itinerary/generate',
  SAVE_ITINERARY: '/itinerary/save',
  UPLOAD_PHOTOS: '/journal/upload',
  GENERATE_JOURNAL: '/journal/generate'
};