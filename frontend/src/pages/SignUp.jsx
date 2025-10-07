import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

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
        <div className="auth-container">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-black-800 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="error-message text-center p-3 bg-red-100 text-red-700 rounded-md">{error}</p>}
                    {success && <p className="success-message text-center p-3 bg-green-100 text-green-700 rounded-md">{success}</p>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="form-group">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                                className="input-field rounded-t-md"
                                placeholder="Username"
                            />
                        </div>
                         <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="input-field"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="input-field rounded-b-md"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn-primary group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                    <p className="auth-switch text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/signin" className="font-medium text-[#14B8A6] hover:text-opacity-80">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;

