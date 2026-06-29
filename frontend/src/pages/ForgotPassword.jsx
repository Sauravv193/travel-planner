import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message || 'Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-orb" style={{ width: '350px', height: '350px', top: '-15%', right: '-10%', animation: 'float 8s ease-in-out infinite' }} />
      <div className="auth-orb" style={{ width: '250px', height: '250px', bottom: '-10%', left: '-5%', animation: 'float 10s ease-in-out infinite 2s' }} />
      
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <div className="auth-glass-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-maroon-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-warm-dark dark:text-white glow-text">Forgot Password?</h1>
            <p className="text-sm text-brown-600 dark:text-night-muted mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/80 dark:bg-red-500/10 backdrop-blur-sm border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
            )}
            {message && (
              <div className="bg-green-50/80 dark:bg-green-500/10 backdrop-blur-sm border border-green-200 dark:border-green-800/30 rounded-xl px-4 py-3 text-green-700 dark:text-green-400 text-sm font-medium">{message}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-dark dark:text-night-text mb-2">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field w-full" placeholder="Enter your email" />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 flex items-center justify-center text-base font-semibold">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Sending...
                </span>
              ) : 'Send Reset Link'}
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

export default ForgotPassword;
