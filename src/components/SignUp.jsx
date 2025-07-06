import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup } from './axios/api';
import './SignUp.css';

const SignUp = () => {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await signup(form);
      
      // Si l'inscription réussit, connecter automatiquement l'utilisateur
      if (response.data) {
        // Simulation d'un token (à adapter selon votre API)
        const token = response.data.token || 'signup-token-' + Date.now();
        login({ username: form.username, email: form.email }, token);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setError('Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join Cryptoplace to start your crypto journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              id="username"
              name="username" 
              type="text"
              placeholder="Choose a username" 
              value={form.username}
              onChange={handleChange} 
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input 
              id="email"
              name="email" 
              type="email"
              placeholder="Enter your email address" 
              value={form.email}
              onChange={handleChange} 
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Create a secure password" 
              value={form.password}
              onChange={handleChange} 
              className="form-input"
              required
            />
            <div className="password-requirements">
              <ul>
                <li>At least 8 characters</li>
                <li>Mix of letters and numbers</li>
              </ul>
            </div>
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
