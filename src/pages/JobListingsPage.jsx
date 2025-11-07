import React, { useState } from 'react';
import JobCard from '../components/JobCard';
import dbData from '../data/db.json';
import '../styles/jobs.css';

const JobListingsPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Get all jobs and organizers
  const { jobs, organizers } = dbData;

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const organizer = organizers.find(org => org.id === job.organizerId);
    
    const matchesSearch = 
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      !locationFilter || 
      (organizer && organizer.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    return matchesSearch && matchesLocation;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'compensation') {
      return b.compensation_ksh - a.compensation_ksh;
    }
    return 0; // Default: keep original order (by date)
  });

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <div className="jobs-header">
          <h1>Find Your Next Opportunity</h1>
          <p>{sortedJobs.length} jobs available</p>
        </div>

        <div className="jobs-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date Posted</option>
                <option value="compensation">Highest Pay</option>
              </select>
            </div>
          </div>
        </div>

        <div className="jobs-grid">
          {sortedJobs.length > 0 ? (
            sortedJobs.map(job => {
              const organizer = organizers.find(org => org.id === job.organizerId);
              return (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  organizer={organizer}
                  userType={user?.type}
                />
              );
            })
          ) : (
            <div className="no-jobs">
              <p>No jobs found matching your criteria.</p>
              <p>Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListingsPage;