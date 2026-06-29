import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProfile = () => {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response.data);
      } catch (error) {
      // Handle error
        setError('Could not load your profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedData = {
        username: profile.username,
      };
      // Only include the password in the request if the user entered one
      if (password) {
        updatedData.password = password;
      }
      
      await updateUserProfile(updatedData);
      setMessage('Profile updated successfully! You may need to log in again to see all changes.');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white/80 dark:bg-night-card/80 backdrop-blur-sm border border-cream-100 dark:border-night-border rounded-2xl shadow-glass p-8">
        <h1 className="text-2xl font-bold text-warm-dark dark:text-white mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-warm-dark dark:text-night-text">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="input-field dark:input-field"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-warm-dark dark:text-night-text">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              className="input-field bg-cream-100 dark:bg-night-surface/50 dark:border-night-border"
              disabled
            />
            <p className="text-xs text-cream-500 dark:text-night-muted mt-1">Email address cannot be changed.</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-warm-dark dark:text-night-text">
              New Password (optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field dark:input-field"
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field dark:input-field"
              disabled={!password}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 rounded-xl text-sm font-semibold text-white bg-maroon-500 hover:bg-maroon-600 hover:shadow-lg hover:shadow-maroon-500/20 transition-all duration-300"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;