import React, { useState, useEffect } from 'react';
import { getApplicationsByUser, getApplicationsByJob } from '../services/jobService';
import '../styles/applications.css';

const ApplicationsPage = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    try {
      const apps = await getApplicationsByUser(user.uid);
      console.log('Loaded applications:', apps); // Debug log
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  return (
    <div className="applications-page">
      <div className="applications-container">
        <h1>My Applications</h1>
        
        {loading ? (
          <div>Loading applications...</div>
        ) : applications.length > 0 ? (
          <div className="applications-list">
            {applications.map(app => (
              <div key={app.id} className="application-card">
                <div className="app-header">
                  <h3>{app.jobTitle || 'Job Title'}</h3>
                  <span className={`status ${app.status || 'pending'}`}>{app.status || 'pending'}</span>
                </div>
                <p>Organization: {app.organizerName || 'N/A'}</p>
                <p>Applied: {app.appliedAt?.seconds ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-applications">
            <p>You haven't applied to any jobs yet.</p>
            <p>Go to <a href="/jobs">Find Jobs</a> to start applying!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;