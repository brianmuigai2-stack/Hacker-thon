import React, { useState } from 'react';

const JobSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    minSalary: ''
  });

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Hospitality',
    'Agriculture', 'Manufacturing', 'Retail', 'Healthcare', 'Education'
  ];

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { search: '', category: '', location: '', minSalary: '' };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <div className="job-search">
      <div className="search-row">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search jobs by title or description..."
          className="search-input"
        />
        <button onClick={clearFilters} className="clear-btn">Clear</button>
      </div>
      
      <div className="filters-row">
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location (e.g., Nairobi)"
        />
        
        <input
          type="number"
          name="minSalary"
          value={filters.minSalary}
          onChange={handleChange}
          placeholder="Min Salary (KSh)"
        />
      </div>
    </div>
  );
};

export default JobSearch;