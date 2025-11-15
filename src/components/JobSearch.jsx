import React, { useState } from 'react';

const JobSearch = ({ onSearch, jobCount = 0 }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    duration: '',
    sortBy: 'newest'
  });

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Hospitality',
    'Agriculture', 'Manufacturing', 'Retail', 'Healthcare', 'Education'
  ];

  const durations = ['1 Day', '2 Days', '3 Days', '1 Week', '2 Weeks', '1 Month'];
  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Thika'];

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { search: '', category: '', location: '', minSalary: '', maxSalary: '', duration: '', sortBy: 'newest' };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <div className="job-search">
      <div className="search-header">
        <div className="search-row">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="🔍 Search jobs by title, description, or company..."
            className="search-input"
          />
          <button onClick={clearFilters} className="clear-btn">Clear All</button>
        </div>
        <div className="results-count">
          {jobCount} job{jobCount !== 1 ? 's' : ''} found
        </div>
      </div>
      
      <div className="filters-grid">
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select name="location" value={filters.location} onChange={handleChange}>
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        
        <input
          type="number"
          name="minSalary"
          value={filters.minSalary}
          onChange={handleChange}
          placeholder="Min Salary (KSh)"
        />
        
        <input
          type="number"
          name="maxSalary"
          value={filters.maxSalary}
          onChange={handleChange}
          placeholder="Max Salary (KSh)"
        />
        
        <select name="duration" value={filters.duration} onChange={handleChange}>
          <option value="">Any Duration</option>
          {durations.map(dur => (
            <option key={dur} value={dur}>{dur}</option>
          ))}
        </select>
        
        <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="salary-high">Highest Salary</option>
          <option value="salary-low">Lowest Salary</option>
          <option value="duration">By Duration</option>
        </select>
      </div>
    </div>
  );
};

export default JobSearch;