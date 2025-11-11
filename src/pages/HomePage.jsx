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
      </section>

      <section className="features-section">
        <h2 className="section-title">How JobLink Kenya Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="Creating profile"
              className="feature-image"
            />
            <h3>Create Your Profile</h3>
            <p>Share your skills, experience, and what you're looking for. Let employers find you.</p>
          </div>
          
          <div className="feature-card">
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="Finding local jobs"
              className="feature-image"
            />
            <h3>Find Local Jobs</h3>
            <p>Browse opportunities from NGOs, companies, and community organizations near you.</p>
          </div>
          
          <div className="feature-card">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
              alt="Connecting with employers"
              className="feature-image"
            />
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

      <section className="work-showcase">
        <h2 className="section-title">Real People, Real Opportunities</h2>
        <div className="showcase-grid">
          <div className="showcase-item">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Construction worker in Kenya"
            />
            <div className="showcase-overlay">
              <h4>Construction</h4>
              <p>Building Kenya's future</p>
            </div>
          </div>
          <div className="showcase-item">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Delivery services in Kenya"
            />
            <div className="showcase-overlay">
              <h4>Delivery</h4>
              <p>Connecting communities</p>
            </div>
          </div>
          <div className="showcase-item">
            <img 
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Agriculture work in Kenya"
            />
            <div className="showcase-overlay">
              <h4>Agriculture</h4>
              <p>Feeding our nation</p>
            </div>
          </div>
          <div className="showcase-item">
            <img 
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Cleaning services in Kenya"
            />
            <div className="showcase-overlay">
              <h4>Cleaning</h4>
              <p>Keeping Kenya clean</p>
            </div>
          </div>
        </div>
      </section>

      <section className="video-section">
        <h2 className="section-title">See JobLink Kenya in Action</h2>
        <div className="video-container">
          <iframe 
            width="100%" 
            height="400" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="JobLink Kenya - Empowering Youth" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
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