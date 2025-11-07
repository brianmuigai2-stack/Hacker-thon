import React, { useState } from 'react';
import JobPostForm from '../components/JobPostForm';
import JobCard from '../components/JobCard';
import dbData from '../data/db.json';
import '../styles/dashboard.css';

const OrganisationDashboard = ({ user }) => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);

  // Mock: Get jobs for this organisation
  const { jobs, organizers } = dbData;
  const userOrganizer = organizers.find(org => org.name === user.name) || organizers[0];
  const organisationJobs = jobs.filter(job => job.organizerId === userOrganizer.id);

  const allJobs = [...organisationJobs, ...postedJobs];

  const handleJobPosted = (newJob) => {
    setPostedJobs([newJob, ...postedJobs]);
    setShowPostForm(false);
  };

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
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{allJobs.length}</h3>
              <p>Total Jobs Posted</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{allJobs.filter(j => j.availability === 'Open').length}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
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
          
          {allJobs.length > 0 ? (
            <div className="jobs-grid">
              {allJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  organizer={userOrganizer}
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