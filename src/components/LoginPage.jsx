import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, setLoading } from '../store/slices/authSlice';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error } = useSelector(state => state.auth);

  // Page de redirection après connexion (ou page d'accueil par défaut)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const loginPayload = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', loginPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Success - update Redux state
      dispatch(loginSuccess({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user || { username, email: response.data.email }
      }));
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      dispatch(loginFailure(
        err?.response?.data?.message || 'Invalid username or password. Please try again.'
      ));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
