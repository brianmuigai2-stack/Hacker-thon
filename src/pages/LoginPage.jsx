import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle, handleGoogleRedirectResult, resetPassword } from '../services/authService';
import { validateEmailStrength } from '../utils/emailValidator';
import '../styles/auth.css';

const LoginPage = ({ onLogin }) => {
  const [userType, setUserType] = useState('seeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = validateEmailStrength(email);
    if (!emailValidation.valid) {
      alert(emailValidation.message);
      return;
    }
    
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(userType);
    } catch (error) {
      alert('Google sign-in failed: ' + error.message);
    }
  };

  React.useEffect(() => {
    const handleRedirect = async () => {
      try {
        const user = await handleGoogleRedirectResult();
        if (user) {
          onLogin(user);
          navigate(user.type === 'seeker' ? '/jobs' : '/dashboard');
        }
      } catch (error) {
        console.error('Google redirect error:', error);
        alert('Google sign-in failed: ' + error.message);
      }
    };
    handleRedirect();
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      alert('Please enter your email address');
      return;
    }
    
    try {
      await resetPassword(resetEmail);
      alert('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      alert('Error sending reset email: ' + error.message);
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

          <div className="divider">
            <span>or</span>
          </div>

          <button onClick={handleGoogleSignIn} className="btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-links">
            <button 
              type="button" 
              onClick={() => setShowForgotPassword(true)}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>

          {showForgotPassword && (
            <div className="forgot-password-modal">
              <div className="modal-content">
                <h3>Reset Password</h3>
                <form onSubmit={handleForgotPassword}>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowForgotPassword(false)}>
                      Cancel
                    </button>
                    <button type="submit">Send Reset Email</button>
                  </div>
                </form>
              </div>
            </div>
          )}
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