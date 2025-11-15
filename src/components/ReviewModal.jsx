import React, { useState } from 'react';
import { addReview } from '../services/reviewService';

const ReviewModal = ({ isOpen, onClose, reviewedUser, jobId, reviewerId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addReview({
        reviewerId,
        reviewedUserId: reviewedUser.uid,
        jobId,
        rating,
        comment,
        reviewerName: reviewerId // You'd get this from user data
      });
      
      alert('Review submitted successfully!');
      onClose();
      setRating(5);
      setComment('');
    } catch (error) {
      alert('Error submitting review: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="review-modal">
        <div className="modal-header">
          <h3>Rate {reviewedUser.name}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          
          <div className="comment-section">
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="4"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-submit">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;