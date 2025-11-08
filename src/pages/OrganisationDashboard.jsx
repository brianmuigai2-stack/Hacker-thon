import React, { useState, useEffect } from 'react';
import JobPostForm from '../components/JobPostForm';
import JobCard from '../components/JobCard';
import { getJobsByOrganizer } from '../services/jobService';
import '../styles/dashboard.css';

const OrganisationDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [user.uid]);

  const loadJobs = async () => {
    try {
      const userJobs = await getJobsByOrganizer(user.uid);
      setJobs(userJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobPosted = (newJob) => {
    setJobs([newJob, ...jobs]);
    setShowPostForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Organisation Dashboard</h1>
            <p>Welcome back, {user.name}</p>
          </div>
          <button 
            className="btn-post-job"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            {showPostForm ? '✕ Cancel' : '+ Post New Job'}
          </button>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-info">
              <h3>{jobs.length}</h3>
              <p>Total Jobs Posted</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-info">
              <h3>{jobs.filter(j => j.availability === 'Open').length}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-info">
              <h3>0</h3>
              <p>Applications</p>
            </div>
          </div>
        </div>

        {showPostForm && (
          <div className="post-form-section">
            <JobPostForm onJobPosted={handleJobPosted} />
          </div>
        )}

        <div className="dashboard-jobs-section">
          <h2>Your Posted Jobs</h2>
          
          {jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  organizer={{ name: user.name }}
                  userType="organisation"
                />
              ))}
            </div>
          ) : (
            <div className="no-jobs-placeholder">
              <p>You haven't posted any jobs yet.</p>
              <button 
                className="btn-primary"
                onClick={() => setShowPostForm(true)}
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganisationDashboard;