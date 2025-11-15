import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/communityService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/community.css';

const CommunityPage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const filterType = filter === 'all' ? null : filter;
      const allUsers = await getAllUsers(user.uid, filterType);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="large" text="Loading community..." />;

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="community-header">
          <h1>Community</h1>
          <p>Connect with other users on KaziConnect</p>
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Users ({users.length})
          </button>
          <button 
            className={filter === 'seeker' ? 'active' : ''}
            onClick={() => setFilter('seeker')}
          >
            Job Seekers
          </button>
          <button 
            className={filter === 'organisation' ? 'active' : ''}
            onClick={() => setFilter('organisation')}
          >
            Organizations
          </button>
        </div>

        <div className="users-grid">
          {users.map(userProfile => (
            <div key={userProfile.id} className="user-card">
              <div className="user-avatar">
                {userProfile.profileImage ? (
                  <img src={userProfile.profileImage} alt={userProfile.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {userProfile.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              
              <div className="user-info">
                <h3>{userProfile.name}</h3>
                <span className={`user-type ${userProfile.type}`}>
                  {userProfile.type === 'seeker' ? '👤 Job Seeker' : '🏢 Organization'}
                </span>
                
                {userProfile.location && (
                  <p className="user-location">📍 {userProfile.location}</p>
                )}
                
                {userProfile.bio && (
                  <p className="user-bio">{userProfile.bio}</p>
                )}
                
                {userProfile.skills && (
                  <div className="user-skills">
                    {userProfile.skills.split(',').slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;