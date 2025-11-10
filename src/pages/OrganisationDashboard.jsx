import React, { useState, useEffect } from 'react';
import JobPostForm from '../components/JobPostForm';
import JobCard from '../components/JobCard';
import { getJobsByOrganizer, getApplicationsByJob, updateApplicationStatus, deleteJob } from '../services/jobService';
import { sendApplicationStatusNotification } from '../services/notificationService';
import '../styles/dashboard.css';
import '../styles/search.css';

const OrganisationDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingAppId, setUpdatingAppId] = useState(null);

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

  const handleStatusUpdate = async (appId, status, app) => {
    console.log('Starting status update process for:', {
      appId,
      status,
      applicant: app.userName,
      userId: app.userId
    });

    setUpdatingAppId(appId);
    
    // Show prompt for additional message
    const promptMessage = status === 'accepted' 
      ? `Accepting application from ${app.userName}\n\nWould you like to add a message? (e.g., "Please call us at 0712345678" or "Start date is Nov 15th")`
      : `Rejecting application from ${app.userName}\n\nWould you like to add a message? (e.g., "Thank you for applying" or "We'll keep your info for future opportunities")`;
    
    const userInput = prompt(promptMessage);
    
    console.log('User input received:', {
      userInput,
      isNull: userInput === null,
      isEmpty: userInput === '',
      type: typeof userInput
    });
    
    // If user cancels, don't proceed
    if (userInput === null) {
      console.log('User cancelled the prompt');
      setUpdatingAppId(null);
      return;
    }
    
    // Process the message - even if empty
    const additionalMessage = userInput.trim();
    
    console.log('Processed message:', {
      original: userInput,
      trimmed: additionalMessage,
      isEmpty: additionalMessage === '',
      length: additionalMessage.length
    });

    try {
      // Step 1: Update application status in database
      console.log('Updating application status in database...');
      await updateApplicationStatus(appId, status);
      console.log('Application status updated');
      
      // Step 2: Send notification with the message
      console.log('Sending notification with data:', {
        userId: app.userId,
        jobTitle: app.jobTitle,
        status: status,
        additionalMessage: additionalMessage,
        hasMessage: additionalMessage !== ''
      });
      
      await sendApplicationStatusNotification(
        app.userId,
        app.jobTitle,
        status,
        additionalMessage
      );
      
      console.log('Notification sent successfully');
      
      // Step 3: Reload applications
      await loadApplications();
      
      // Step 4: Show success message
      if (additionalMessage !== '') {
        alert(`Application ${status}!\n\n Notification sent to ${app.userName} with your message:\n"${additionalMessage}"`);
      } else {
        alert(`Application ${status}!\n\n Notification sent to ${app.userName}.`);
      }
    } catch (error) {
      console.error('Error in status update process:', error);
      alert('Error updating application: ' + error.message);
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleJobPosted = () => {
    setShowPostForm(false);
    loadJobs();
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowPostForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
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

  if (loading) return <div className="loading">Loading...</div>;

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
              {showApplications ? 'Hide Applications' : `View Applications (${applications.length})`}
            </button>
            <button 
              className="btn-post-job"
              onClick={() => {
                setEditingJob(null);
                setShowPostForm(!showPostForm);
              }}
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
              <p>Total Applications</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{applications.filter(a => a.status === 'pending').length}</h3>
              <p>Pending Reviews</p>
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
                      <p><strong>Applied for:</strong> {app.jobTitle}</p>
                      <p><strong>Email:</strong> {app.userEmail}</p>
                      <p><strong>Applied:</strong> {app.appliedAt?.seconds 
                        ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() 
                        : new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="app-actions">
                      <span className={`status ${app.status}`}>{app.status}</span>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'accepted', app)}
                            className="btn-accept"
                            disabled={updatingAppId === app.id}
                          >
                            {updatingAppId === app.id ? ' Processing...' : ' Accept'}
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'rejected', app)}
                            className="btn-reject"
                            disabled={updatingAppId === app.id}
                          >
                            {updatingAppId === app.id ? ' Processing...' : ' Reject'}
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