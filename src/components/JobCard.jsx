import React, { useState, useEffect } from 'react';
import { applyToJob, getApplicationsByUser, withdrawApplication } from '../services/jobService';

const JobCard = ({ job, organizer, userType, user }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (user && userType === 'seeker') {
      checkApplicationStatus();
    }
  }, [job.id, user]);

  const checkApplicationStatus = async () => {
    if (!user?.uid) return;
    try {
      const applications = await getApplicationsByUser(user.uid);
      const applied = applications.some(app => app.jobId === job.id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In production, save to database
    alert(isSaved ? 'Job removed from saved list' : 'Job saved!');
  };

  const handleApply = async () => {
    if (!hasApplied && user && !applying) {
      setApplying(true);
      try {
        await applyToJob(job.id, user.uid, {
          userName: user.name,
          userEmail: user.email,
          jobTitle: job.job_title,
          organizerId: job.organizerId,
          organizerName: job.organizerName || 'Organization'
        });
        setHasApplied(true);
        alert(`Application submitted for ${job.job_title}!`);
      } catch (error) {
        alert('Error submitting application: ' + error.message);
      }
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (hasApplied && user) {
      try {
        const applications = await getApplicationsByUser(user.uid);
        const userApp = applications.find(app => app.jobId === job.id);
        if (userApp) {
          await withdrawApplication(userApp.id, job.id);
          setHasApplied(false);
          alert('Application withdrawn!');
        }
      } catch (error) {
        alert('Error withdrawing application: ' + error.message);
      }
    }
  };

  return (
    <div className={`job-card ${job.availability === 'Closed' ? 'closed' : ''}`}>
      <div className="job-header">
        <h3 className="job-title">{job.job_title}</h3>
        <span className={`job-status ${job.availability.toLowerCase()}`}>
          {job.availability}
        </span>
      </div>

      <div className="job-details">
        <p className="job-description">{job.description}</p>
        
        <div className="job-info-grid">
          <div className="info-item">
            <span className="info-label">Organisation:</span>
            <span className="info-value">{organizer?.name || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Category:</span>
            <span className="info-value">{job.category || 'General'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Location:</span>
            <span className="info-value">{job.location || organizer?.location || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Duration:</span>
            <span className="info-value">{job.duration}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Start Date:</span>
            <span className="info-value">{job.time_to_start}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Compensation:</span>
            <span className="info-value compensation">KSh {job.compensation_ksh.toLocaleString()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Contact:</span>
            <span className="info-value">{organizer?.contact_email || 'N/A'}</span>
          </div>
        </div>
      </div>

      {userType === 'seeker' && job.availability === 'Open' && (
        <div className="job-actions">
          <button 
            className={`btn-save ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            {isSaved ? ' Saved' : ' Save Job'}
          </button>
          {!hasApplied ? (
            <button 
              className="btn-apply"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          ) : (
            <>
              <button className="btn-applied" disabled>
                ✓ Applied
              </button>
              <button 
                className="btn-withdraw"
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            </>
          )}
          
          {job.applicationsCount > 0 && (
            <span className="applications-count">
              {job.applicationsCount} applicant{job.applicationsCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;