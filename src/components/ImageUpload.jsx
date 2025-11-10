import React, { useState, useRef } from 'react';
import { uploadProfileImage } from '../services/storageService';

const ImageUpload = ({ userId, currentImage, onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    setUploading(true);
    try {
      const imageUrl = await uploadProfileImage(userId, file);
      onImageUploaded(imageUrl);
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message);
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <div 
        className="image-preview"
        onClick={() => !uploading && fileInputRef.current.click()}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        {preview ? (
          <img src={preview} alt="Profile" className="preview-image" />
        ) : (
          <div className="placeholder-avatar">
            <span></span>
          </div>
        )}
        {uploading && (
          <div className="upload-overlay">
            <span>Uploading...</span>
          </div>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        className="upload-btn"
      >
        {uploading ? 'Uploading...' : 'Change Photo'}
      </button>
    </div>
  );
};

export default ImageUpload;