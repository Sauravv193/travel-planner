import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Invalid password reset link. Please request a new one.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="auth-glass-card text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-warm-dark dark:text-white mb-2">Invalid Reset Link</h1>
            <p className="text-brown-600 dark:text-night-muted mb-6">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="btn-primary py-2.5 px-6 inline-block">Request New Link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-orb" style={{ width: '350px', height: '350px', top: '-15%', right: '-10%', animation: 'float 8s ease-in-out infinite' }} />
      <div className="auth-orb" style={{ width: '250px', height: '250px', bottom: '-10%', left: '-5%', animation: 'float 10s ease-in-out infinite 2s' }} />
      
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <div className="auth-glass-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-maroon-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-warm-dark dark:text-white glow-text">Reset Password</h1>
            <p className="text-sm text-brown-600 dark:text-night-muted mt-2">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/80 dark:bg-red-500/10 backdrop-blur-sm border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
            )}
            {message && (
              <div className="bg-green-50/80 dark:bg-green-500/10 backdrop-blur-sm border border-green-200 dark:border-green-800/30 rounded-xl px-4 py-3 text-green-700 dark:text-green-400 text-sm font-medium">{message} Redirecting to sign in...</div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warm-dark dark:text-night-text mb-2">New Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field w-full" placeholder="At least 6 characters" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-warm-dark dark:text-night-text mb-2">Confirm New Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="input-field w-full" placeholder="Repeat your password" />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 flex items-center justify-center text-base font-semibold">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Resetting...
                </span>
              ) : 'Reset Password'}
            </button>

            <div className="divider-gradient" />

            <div className="text-center">
              <Link to="/signin" className="text-sm text-maroon-600 dark:text-maroon-400 hover:text-maroon-700 dark:hover:text-maroon-300 font-medium">
                ← Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
