import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import JobSearch from '../components/JobSearch';
import MigrateButton from '../components/MigrateButton';
import { getJobs } from '../services/jobService';
import '../styles/jobs.css';
import '../styles/search.css';

const JobListingsPage = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      const jobsData = await getJobs(filters);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Find Your Next Opportunity</h1>
          <p>{jobs.length} jobs available</p>
        </div>

        <JobSearch onSearch={handleSearch} />

        <div className="jobs-grid">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                organizer={{ name: job.organizerName }}
                userType={user?.type}
                user={user}
              />
            ))
          ) : (
            <div className="no-jobs">
              <p>No jobs found matching your criteria.</p>
              <p>Try adjusting your filters or check back later for new opportunities.</p>
              <MigrateButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListingsPage;