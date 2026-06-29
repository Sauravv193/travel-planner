import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveToken, removeToken } from '../services/storage';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('OAuth authentication failed. Please try again.');
      return;
    }

    if (!token) {
      setError('No authentication token received. Please try signing in again.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        saveToken(token);
        setUser({
          id: decoded.id,
          username: decoded.sub,
          email: decoded.email,
        });
        navigate('/', { replace: true });
      } else {
        removeToken();
        setError('Token has expired. Please try signing in again.');
      }
    } catch (err) {
      setError('Failed to process authentication. Please try signing in again.');
    }
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="auth-glass-card text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-warm-dark dark:text-white mb-2">Authentication Failed</h2>
          <p className="text-brown-600 dark:text-night-muted mb-6">{error}</p>
          <button onClick={() => navigate('/signin')} className="btn-primary py-2.5 px-6">Back to Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" text="Completing sign in..." />
      </div>
    </div>
  );
};

export default OAuthCallback;
