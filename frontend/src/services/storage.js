// A key to uniquely identify our token in the browser's local storage.
const TOKEN_KEY = 'travel_planner_auth_token';
const REFRESH_TOKEN_KEY = 'travel_planner_refresh_token';

/**
 * Saves the user's authentication token to local storage.
 * @param {string} token - The JWT received from the backend.
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves the user's authentication token from local storage.
 * @returns {string|null} - The token, or null if it's not found.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes the user's authentication token from local storage (for logout).
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Saves the refresh token to local storage.
 * @param {string} refreshToken - The refresh token from the backend.
 */
export const saveRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Retrieves the refresh token from local storage.
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};