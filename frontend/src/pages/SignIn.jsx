import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to sign in. Please check your credentials.";
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
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="error-message text-center p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </p>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="form-group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
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
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <p className="auth-switch text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-[#14B8A6] hover:text-opacity-80">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;