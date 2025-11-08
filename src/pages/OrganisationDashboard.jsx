import React, { useState, useEffect } from 'react';
import JobPostForm from '../components/JobPostForm';
import JobCard from '../components/JobCard';
import { getJobsByOrganizer, getApplicationsByJob, updateApplicationStatus, deleteJob, updateJob } from '../services/jobService';
import { getUserProfile } from '../services/userService';
import '../styles/dashboard.css';
import '../styles/search.css';

const OrganisationDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
    loadApplications();
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

  const loadApplications = async () => {
    try {
      const userJobs = await getJobsByOrganizer(user.uid);
      const allApps = [];
      for (const job of userJobs) {
        const jobApps = await getApplicationsByJob(job.id);
        const appsWithJobInfo = jobApps.map(app => ({ ...app, jobTitle: job.job_title }));
        allApps.push(...appsWithJobInfo);
      }
      setApplications(allApps);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      loadApplications();
      alert(`Application ${status}!`);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const handleJobPosted = (newJob) => {
    setJobs([newJob, ...jobs]);
    setShowPostForm(false);
    loadJobs();
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowPostForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        loadJobs();
        loadApplications();
        alert('Job deleted successfully!');
      } catch (error) {
        alert('Error deleting job: ' + error.message);
      }
    }
  };

  const handleJobUpdated = () => {
    setEditingJob(null);
    setShowPostForm(false);
    loadJobs();
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
          <div className="header-actions">
            <button 
              className="btn-secondary"
              onClick={() => setShowApplications(!showApplications)}
            >
              {showApplications ? 'Hide Applications' : 'View Applications'}
            </button>
            <button 
              className="btn-post-job"
              onClick={() => setShowPostForm(!showPostForm)}
            >
              {showPostForm ? '✕ Cancel' : '+ Post New Job'}
            </button>
          </div>
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
              <h3>{applications.length}</h3>
              <p>Applications</p>
            </div>
          </div>
        </div>

        {showPostForm && (
          <div className="post-form-section">
            <JobPostForm 
              onJobPosted={editingJob ? handleJobUpdated : handleJobPosted}
              editingJob={editingJob}
            />
          </div>
        )}

        {showApplications && (
          <div className="applications-section">
            <h2>Job Applications</h2>
            {applications.length > 0 ? (
              <div className="applications-list">
                {applications.map(app => (
                  <div key={app.id} className="application-item">
                    <div className="app-info">
                      <h4>{app.userName}</h4>
                      <p>Applied for: {app.jobTitle}</p>
                      <p>Email: {app.userEmail}</p>
                      <p>Applied: {app.appliedAt?.seconds ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="app-actions">
                      <span className={`status ${app.status}`}>{app.status}</span>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                            className="btn-accept"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="btn-reject"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No applications yet.</p>
            )}
          </div>
        )}

        <div className="dashboard-jobs-section">
          <h2>Your Posted Jobs</h2>
          
          {jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-management-card">
                  <JobCard 
                    job={job} 
                    organizer={{ name: user.name }}
                    userType="organisation"
                  />
                  <div className="job-actions">
                    <button 
                      onClick={() => handleEditJob(job)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
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