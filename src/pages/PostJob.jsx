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
;
    
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
    