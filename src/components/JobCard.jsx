import React, { useState } from 'react';

const JobCard = ({ job, organizer, userType }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In production, save to database
    alert(isSaved ? 'Job removed from saved list' : 'Job saved!');
  };
  const handleApply = () => {
    if (!hasApplied) {
      setHasApplied(true);
      alert(`Application submitted for ${job.job_title}!`);
      // In production, submit application to database
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
            <span className="info-label">Location:</span>
            <span className="info-value">{organizer?.location || 'N/A'}</span>
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
          <button 
            className={`btn-apply ${hasApplied ? 'applied' : ''}`}
            onClick={handleApply}
            disabled={hasApplied}
          >
            {hasApplied ? '✓ Applied' : 'Apply Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;