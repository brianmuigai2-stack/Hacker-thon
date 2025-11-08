import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../services/authService';
import '../styles/auth.css';

const LoginPage = ({ onLogin }) => {
  const [userType, setUserType] = useState('seeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signIn(email, password);
      if (user.type === userType) {
        onLogin(user);
        navigate(userType === 'seeker' ? '/jobs' : '/dashboard');
      } else {
        alert('User type mismatch');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Login to continue your job search</p>

          <div className="user-type-toggle">
            <button
              className={`type-btn ${userType === 'seeker' ? 'active' : ''}`}
              onClick={() => setUserType('seeker')}
            >
              Job Seeker
            </button>
            <button
              className={`type-btn ${userType === 'organisation' ? 'active' : ''}`}
              onClick={() => setUserType('organisation')}
            >
              Organisation
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>

        <div className="auth-info">
          <h2>Find Your Next Opportunity</h2>
          <ul>
            <li>✓ Access hundreds of local jobs</li>
            <li>✓ Connect with trusted employers</li>
            <li>✓ Build your professional profile</li>
            <li>✓ Get hired faster</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;