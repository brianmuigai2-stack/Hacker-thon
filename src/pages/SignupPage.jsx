import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const SignupPage = ({ onLogin }) => {
  const [userType, setUserType] = useState('seeker');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new user
    const newUser = {
      id: Date.now(),
      ...formData,
      type: userType
    };

    // Save to localStorage (mock database)
    const existingUsers = JSON.parse(localStorage.getItem('joblink-users') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('joblink-users', JSON.stringify(existingUsers));

    // Log in the user
    onLogin(newUser);
    navigate(userType === 'seeker' ? '/jobs' : '/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Join JobLink Kenya</h1>
          <p className="auth-subtitle">Start your journey to employment today</p>

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
              <label htmlFor="name">
                {userType === 'seeker' ? 'Full Name' : 'Organisation Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={userType === 'seeker' ? 'John Doe' : 'Your Organisation'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Nairobi, Mombasa"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="btn-submit">
              Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>

        <div className="auth-info">
          <h2>Why Join JobLink Kenya?</h2>
          <ul>
            <li>✓ Free to join and use</li>
            <li>✓ Verified local employers</li>
            <li>✓ Daily job opportunities</li>
            <li>✓ Community-driven platform</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;