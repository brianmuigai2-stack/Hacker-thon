import React, { useState, useEffect } from 'react';
import { createJob, updateJob } from '../services/jobService';

const JobPostForm = ({ onJobPosted, editingJob }) => {
  const [jobData, setJobData] = useState({
    job_title: '',
    description: '',
    category: '',
    location: '',
    compensation_ksh: '',
    duration: '',
    time_to_start: '',
    availability: 'Open'
  });

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Hospitality',
    'Agriculture', 'Manufacturing', 'Retail', 'Healthcare', 'Education'
  ];

  useEffect(() => {
    if (editingJob) {
      setJobData({
        job_title: editingJob.job_title || '',
        description: editingJob.description || '',
        category: editingJob.category || '',
        location: editingJob.location || '',
        compensation_ksh: editingJob.compensation_ksh || '',
        duration: editingJob.duration || '',
        time_to_start: editingJob.time_to_start || '',
        availability: editingJob.availability || 'Open'
      });
    }
  }, [editingJob]);

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('joblink-user') || '{}');
      
      if (editingJob) {
        await updateJob(editingJob.id, {
          ...jobData,
          compensation_ksh: parseInt(jobData.compensation_ksh)
        });
        alert('Job updated successfully!');
      } else {
        await createJob({
          organizerId: user.uid,
          organizerName: user.name,
          ...jobData,
          compensation_ksh: parseInt(jobData.compensation_ksh)
        });
        alert('Job posted successfully!');
      }
      
      onJobPosted();
      
      if (!editingJob) {
        setJobData({
          job_title: '',
          description: '',
          category: '',
          location: '',
          compensation_ksh: '',
          duration: '',
          time_to_start: '',
          availability: 'Open'
        });
      }
    } catch (error) {
      alert(`Error ${editingJob ? 'updating' : 'posting'} job: ` + error.message);
    }
  };

  return (
    <form className="job-post-form" onSubmit={handleSubmit}>
      <h2>{editingJob ? 'Edit Job' : 'Post a New Job'}</h2>

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
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={jobData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="e.g., Nairobi, Mombasa"
            required
          />
        </div>
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
        {editingJob ? 'Update Job' : 'Post Job'}
      </button>
    </form>
  );
};

export default JobPostForm;