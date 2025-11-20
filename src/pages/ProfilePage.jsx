import React from 'react';
import ProfileForm from '../components/ProfileForm';
import AIRecommendations from '../components/AIRecommendations';
import '../styles/profile.css';

const ProfilePage = ({ user, updateUser }) => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Keep your information up-to-date to help employers find you</p>
        </div>

        <ProfileForm user={user} updateUser={updateUser} />

        {user.type === 'seeker' && (
          <AIRecommendations user={user} />
        )}

        <div className="profile-tips">
          <h3> Profile Tips</h3>
          <ul>
            <li>Complete all sections to increase your visibility</li>
            <li>List specific skills that employers are looking for</li>
            <li>Update your experience regularly</li>
            <li>Be honest and professional in your descriptions</li>
            <li>Include multiple contact methods</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;