import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/login', { email, password });
      
      // Assuming the response includes token, userId, and username
      const { token, userId, username } = response.data;
      
      // Call the login function from AuthContext with all three parameters
      login(token, userId, username);
      toast.success('Login successful');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Welcome to MY BLOG</h1>
          <h2>Sign in to MY BLOG</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Sign in</button>
        </form>
        <div className="auth-link">
          New to MY BLOG? <Link to="/register">Create an account</Link>.
        </div>
      </div>
    </div>
  );
};

export default Login;
