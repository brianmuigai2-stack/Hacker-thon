import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

const Navbar = ({ user, onLogout }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">JobLink Kenya</span>
          <span className="logo-subtitle">Tafuta Kazi</span>
        </Link>

        <div className="navbar-menu">
          {!user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-btn">Get Started</Link>
            </>
          ) : (
            <>
              {user.type === 'seeker' && (
                <>
                  <Link to="/jobs" className="nav-link">Find Jobs</Link>
                  <Link to="/profile" className="nav-link">My Profile</Link>
                </>
              )}
              {user.type === 'organisation' && (
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/jobs" className="nav-link">View Jobs</Link>
                </>
              )}
              <span className="nav-username">Hi, {user.name}</span>
              <button onClick={onLogout} className="nav-btn logout">Logout</button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;