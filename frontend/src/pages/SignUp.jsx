import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setShowForm(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            const response = await signup(username, email, password);
            setSuccess(response.data.message + " Redirecting to sign in...");
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign up. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container-enhanced min-h-screen">
            {/* Animated Background Elements */}
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="gradient-overlay"></div>
            
            <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`auth-form-enhanced max-w-md w-full space-y-8 transition-all duration-1000 transform ${
                    showForm ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                }`}>
                    {/* Header Section */}
                    <div className="text-center fade-in-delayed">
                        <div className="auth-icon-container">
                            <div className="auth-icon signup-icon">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white gradient-text">
                            Join Our Community
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Create your account to start planning amazing trips
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message-enhanced slide-in-left">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="success-message-enhanced slide-in-left">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {success}
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="input-group slide-in-right" style={{animationDelay: '0.1s'}}>
                                <label htmlFor="username" className="input-label">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="input-field-enhanced"
                                    placeholder="Choose a username"
                                />
                            </div>

                            <div className="input-group slide-in-right" style={{animationDelay: '0.2s'}}>
                                <label htmlFor="email" className="input-label">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="input-field-enhanced"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className="input-group slide-in-right" style={{animationDelay: '0.3s'}}>
                                <label htmlFor="password" className="input-label">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="input-field-enhanced"
                                    placeholder="Create a secure password"
                                />
                            </div>
                        </div>

                        <div className="slide-in-right" style={{animationDelay: '0.4s'}}>
                            <button 
                                type="submit" 
                                className={`btn-enhanced group relative w-full transition-all duration-300 ${
                                    isLoading ? 'loading' : ''
                                }`}
                                disabled={isLoading}
                            >
                                <span className={`btn-text ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                    Create Account
                                </span>
                                {isLoading && (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                    </div>
                                )}
                                <div className="btn-glow"></div>
                            </button>
                        </div>

                        <div className="text-center slide-in-right" style={{animationDelay: '0.5s'}}>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link to="/signin" className="auth-link">
                                    Sign In
                                    <span className="link-arrow">→</span>
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

