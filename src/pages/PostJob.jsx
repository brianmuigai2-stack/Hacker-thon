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