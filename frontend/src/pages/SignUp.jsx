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
            const message = response.data.message || 'User registered successfully!';
            setSuccess(message + " Please check your email to verify your account. Redirecting to sign in...");
            setTimeout(() => {
                navigate('/signin');
            }, 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign up. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container-premium">
            {/* Animated Background Shapes - Gold */}
            <div className="auth-shapes">
                <div className="auth-shape"></div>
                <div className="auth-shape"></div>
                <div className="auth-shape"></div>
            </div>

            <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`auth-card transition-all duration-1000 transform ${
                    showForm ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                }`}>
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gold-500/20">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-lux-charcoal dark:text-white gradient-text-premium">
                            Join Our Community
                        </h2>
                        <p className="mt-2 text-lux-taupe dark:text-night-muted">
                            Create your account to start planning amazing trips across India
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 text-red-700 dark:text-red-400 text-sm font-medium animate-fade-in-up">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800/30 rounded-xl px-4 py-3 text-green-700 dark:text-green-400 text-sm font-medium animate-fade-in-up">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {success}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                                <label htmlFor="signup-username" className="block text-sm font-medium text-lux-charcoal dark:text-night-text mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="signup-username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="input-field"
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="animate-fade-in-up" style={{animationDelay: '0.15s'}}>
                                <label htmlFor="signup-email" className="block text-sm font-medium text-lux-charcoal dark:text-night-text mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="input-field"
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                                <label htmlFor="signup-password" className="block text-sm font-medium text-lux-charcoal dark:text-night-text mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="signup-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="input-field"
                                    placeholder="Create a secure password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="animate-fade-in-up" style={{animationDelay: '0.25s'}}>
                            <button
                                type="submit"
                                className="btn-gold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                        <div className="divider-gradient" />

                        <div className="text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                            <p className="text-sm text-lux-taupe dark:text-night-muted">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-gold-600 dark:text-gold-400 font-semibold hover:text-gold-700 dark:hover:text-gold-300 transition-colors">
                                    Sign In <span className="inline-block ml-0.5">→</span>
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