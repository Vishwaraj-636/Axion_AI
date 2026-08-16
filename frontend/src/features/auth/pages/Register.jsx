import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/use.auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, email, password };
    const success = await handleRegister(payload);
    if (success) navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-100">
      <div className="bg-gray-950 p-8 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full max-w-md border border-gray-800">
        <h2 className="text-4xl font-semibold text-white text-center mb-8 tracking-tight">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="block w-full rounded-md border-0 py-3 px-4 bg-gray-900 text-gray-100 placeholder-gray-500 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-colors"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="block w-full rounded-md border-0 py-3 px-4 bg-gray-900 text-gray-100 placeholder-gray-500 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-colors"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full rounded-md border-0 py-3 px-4 bg-gray-900 text-gray-100 placeholder-gray-500 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-colors"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 ease-in-out"
          >
            Register
          </button>
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-500 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;