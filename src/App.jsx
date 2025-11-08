import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { onAuthChange } from './services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({ uid: firebaseUser.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (loading) return <div>Loading...</div>;

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