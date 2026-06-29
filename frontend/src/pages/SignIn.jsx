import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const BACKEND_URL = API_URL.replace('/api', '');

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setShowForm(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign in. Please check your credentials.");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-orb" style={{ width: '400px', height: '400px', top: '-10%', right: '-5%', animation: 'float 8s ease-in-out infinite' }} />
      <div className="auth-orb" style={{ width: '300px', height: '300px', bottom: '-10%', left: '-5%', animation: 'float 10s ease-in-out infinite 2s' }} />
      <div className="auth-orb" style={{ width: '200px', height: '200px', top: '40%', left: '50%', animation: 'float 12s ease-in-out infinite 4s' }} />
      
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`auth-glass-card transition-all duration-1000 transform ${showForm ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-maroon-500/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-warm-dark dark:text-white glow-text">Welcome Back</h2>
            <p className="mt-2 text-brown-600 dark:text-night-muted">Sign in to continue your journey across India</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/80 dark:bg-red-500/10 backdrop-blur-sm border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 text-red-700 dark:text-red-400 text-sm font-medium">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <label htmlFor="username" className="block text-sm font-medium text-warm-dark dark:text-night-text mb-2">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} className="input-field" placeholder="Enter your username" autoComplete="username" />
              </div>
              <div className="animate-fade-in-up" style={{animationDelay: '0.15s'}}>
                <label htmlFor="password" className="block text-sm font-medium text-warm-dark dark:text-night-text mb-2">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="input-field" placeholder="Enter your password" autoComplete="current-password" />
              </div>
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="divider-gradient" />
              <div className="relative flex justify-center -mt-3">
                <span className="px-3 text-xs text-brown-500 dark:text-night-muted bg-white dark:bg-night-card">Or continue with</span>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <a href={`${BACKEND_URL}/oauth2/authorization/google`} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-cream-200 dark:border-night-border rounded-xl bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm hover:border-maroon-300 dark:hover:border-maroon-500/50 hover:shadow-lg hover:shadow-maroon-500/10 transition-all duration-300 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-semibold text-warm-dark dark:text-night-text group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-colors">Sign in with Google</span>
              </a>
            </div>

            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.35s'}}>
              <Link to="/forgot-password" className="text-sm text-brown-600 dark:text-night-muted hover:text-maroon-600 dark:hover:text-maroon-400 transition-colors font-medium">Forgot password?</Link>
            </div>

            <div className="divider-gradient" />

            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <p className="text-sm text-brown-600 dark:text-night-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-maroon-600 dark:text-maroon-400 font-semibold hover:text-maroon-700 dark:hover:text-maroon-300 transition-colors">
                  Sign Up <span className="inline-block ml-0.5">→</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
