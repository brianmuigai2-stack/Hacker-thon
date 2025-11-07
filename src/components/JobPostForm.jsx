import React, { useState } from 'react';

const JobPostForm = ({ onJobPosted }) => {
  const [jobData, setJobData] = useState({
    job_title: '',
    description: '',
    compensation_ksh: '',
    duration: '',
    time_to_start: '',
    availability: 'Open'
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new job object
    const newJob = {
      id: Date.now(),
      organizerId: JSON.parse(localStorage.getItem('joblink-user')).id,
      ...jobData,
      compensation_ksh: parseInt(jobData.compensation_ksh)
    };

    // In production, save to database
    onJobPosted(newJob);
    
    // Reset form
    setJobData({
      job_title: '',
      description: '',
      compensation_ksh: '',
      duration: '',
      time_to_start: '',
      availability: 'Open'
    });
    
    alert('Job posted successfully!');
  };

  return (
    <form className="job-post-form" onSubmit={handleSubmit}>
      <h2>Post a New Job</h2>

      <div className="form-group">
        <label htmlFor="job_title">Job Title *</label>
        <input
          type="text"
          id="job_title"
          name="job_title"
          value={jobData.job_title}
          onChange={handleChange}
          placeholder="e.g., Delivery Assistant"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Job Description *</label>
        <textarea
          id="description"
          name="description"
          value={jobData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe the job responsibilities and requirements..."
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="compensation_ksh">Compensation (KSh) *</label>
          <input
            type="number"
            id="compensation_ksh"
            name="compensation_ksh"
            value={jobData.compensation_ksh}
            onChange={handleChange}
            placeholder="e.g., 1500"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration *</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={jobData.duration}
            onChange={handleChange}
            placeholder="e.g., 2 Days, 1 Week"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="time_to_start">Start Date & Time *</label>
          <input
            type="text"
            id="time_to_start"
            name="time_to_start"
            value={jobData.time_to_start}
            onChange={handleChange}
            placeholder="e.g., 2025-11-10 08:00 AM"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="availability">Status</label>
          <select
            id="availability"
            name="availability"
            value={jobData.availability}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Post Job
      </button>
    </form>
  );
};

export default JobPostForm;