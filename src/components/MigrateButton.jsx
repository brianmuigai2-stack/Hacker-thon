import React, { useState } from 'react';
import { migrateJobsToFirebase } from '../utils/migrateData';

const MigrateButton = () => {
  const [migrating, setMigrating] = useState(false);
  const [migrated, setMigrated] = useState(false);

  const handleMigrate = async () => {
    setMigrating(true);
    const success = await migrateJobsToFirebase();
    setMigrating(false);
    setMigrated(success);
    if (success) {
      alert('Jobs migrated to Firebase! Refresh the page to see them.');
    }
  };

  if (migrated) return null;

  return (
    <div style={{ padding: '20px', textAlign: 'center', background: '#f0f0f0', margin: '20px 0' }}>
      <p>No jobs found. Click to migrate demo data to Firebase:</p>
      <button 
        onClick={handleMigrate} 
        disabled={migrating}
        style={{ 
          padding: '10px 20px', 
          background: '#4f46e5', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: migrating ? 'not-allowed' : 'pointer'
        }}
      >
        {migrating ? 'Migrating...' : 'Load Demo Jobs'}
      </button>
    </div>
  );
};

export default MigrateButton;