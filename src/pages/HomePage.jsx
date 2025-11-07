import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Empowering Kenya's Youth,<br />
            <span className="highlight">One Job at a Time</span>
          </h1>
          <p className="hero-subtitle">
            Connect with local employers, find meaningful work, and build your future.
            JobLink Kenya bridges the gap between opportunity and talent.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">How JobLink Kenya Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Create Your Profile</h3>
            <p>Share your skills, experience, and what you're looking for. Let employers find you.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Find Local Jobs</h3>
            <p>Browse opportunities from NGOs, companies, and community organizations near you.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Apply & Connect</h3>
            <p>Apply directly to jobs that match your skills and start earning today.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Active Jobs</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">1,000+</h3>
            <p className="stat-label">Job Seekers</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Organisations</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">10+</h3>
            <p className="stat-label">Counties</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of Kenyan youth finding opportunities every day</p>
        <Link to="/signup" className="btn-cta">Sign Up Now</Link>
      </section>

      <footer className="homepage-footer">
        <p>&copy; 2025 JobLink Kenya. Built with  for the community.</p>
      </footer>
    </div>
  );
};

export default HomePage;