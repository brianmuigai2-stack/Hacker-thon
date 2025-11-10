import React, { useState } from 'react';
import { updateUserProfile } from '../services/userService';
import ImageUpload from './ImageUpload';

const ProfileForm = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    age: user?.age || '',
    location: user?.location || '',
    contact: user?.contact || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    experience: user?.experience || '',
    services: user?.services || '',
    profileImage: user?.profileImage || ''
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUploaded = (imageUrl) => {
    setProfile({
      ...profile,
      profileImage: imageUrl
    });
    
    // Update localStorage immediately
    const updatedUser = { ...user, profileImage: imageUrl };
    localStorage.setItem('joblink-user', JSON.stringify(updatedUser));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(user.uid, profile);
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('joblink-user', JSON.stringify(updatedUser));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-photo-section">
        <ImageUpload 
          userId={user.uid}
          currentImage={profile.profileImage}
          onImageUploaded={handleImageUploaded}
        />
      </div>

      <div className="form-section">
        <h3>Personal Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
              min="16"
              max="100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="e.g., Nairobi, Kibera"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Phone Number *</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={profile.contact}
              onChange={handleChange}
              placeholder="e.g., +254 712 345678"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Short Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell employers about yourself..."
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Professional Information</h3>
        
        <div className="form-group">
          <label htmlFor="skills">Skills *</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g., Cleaning, Delivery, Construction, Farming"
            required
          />
          <small>Separate skills with commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Previous Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your work experience..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="services">Services You Can Offer</label>
          <textarea
            id="services"
            name="services"
            value={profile.services}
            onChange={handleChange}
            rows="3"
            placeholder="What kind of work are you looking for?"
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        {isSaved ? ' Profile Saved!' : 'Save Profile'}
      </button>
    </form>
  );
};

export default ProfileForm;