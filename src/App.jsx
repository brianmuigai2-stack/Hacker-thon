import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import JobListingsPage from './pages/JobListingsPage';
import OrganisationDashboard from './pages/OrganisationDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in from localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('joblink-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('joblink-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('joblink-user');
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to={user.type === 'seeker' ? '/jobs' : '/dashboard'} /> : <LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to={user.type === 'seeker' ? '/jobs' : '/dashboard'} /> : <SignupPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/profile" 
              element={user && user.type === 'seeker' ? <ProfilePage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/jobs" 
              element={user ? <JobListingsPage user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard" 
              element={user && user.type === 'organisation' ? <OrganisationDashboard user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;