import React, { createContext, useState, useEffect } from 'react';
import { signIn, signUp } from '../services/api';
import { saveToken, getToken, removeToken, saveRefreshToken, getRefreshToken } from '../services/storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- THIS FUNCTION IS THE CORE OF THE FIX ---
  const updateUserFromToken = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if the token is expired
        if (decoded.exp * 1000 > Date.now()) {
          // Ensure all parts of the user object are set correctly from the token
          setUser({
            id: decoded.id,
            username: decoded.sub, // 'sub' is the standard claim for username
            email: decoded.email,
          });
          return true;
        }
      } catch (error) {
        // Handle token decode error silently
      }
    }
    // If token is invalid, expired, or not present, clear user state
    setUser(null);
    removeToken();
    return false;
  };

  useEffect(() => {
    const token = getToken();
    updateUserFromToken(token);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await signIn(username, password);
    const { token, refreshToken, id, username: responseUsername, email } = response.data;
    saveToken(token);
    if (refreshToken) {
      saveRefreshToken(refreshToken);
    }
    // Set user from response data directly (not from JWT decode, which may lack id/email)
    setUser({
      id,
      username: responseUsername,
      email,
    });
  };

  const signup = async (username, email, password) => {
    return await signUp(username, email, password);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  const value = { user, login, signup, logout, loading, setUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};