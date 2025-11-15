import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const addReview = async (reviewData) => {
  const review = await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    createdAt: new Date()
  });
  
  // Update user's average rating
  await updateUserRating(reviewData.reviewedUserId);
  return review;
};

export const getUserReviews = async (userId) => {
  const q = query(
    collection(db, 'reviews'),
    where('reviewedUserId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRating = async (userId) => {
  const reviews = await getUserReviews(userId);
  if (reviews.length === 0) return;
  
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length
  });
};

export const canUserReview = async (reviewerId, reviewedUserId, jobId) => {
  const q = query(
    collection(db, 'reviews'),
    where('reviewerId', '==', reviewerId),
    where('reviewedUserId', '==', reviewedUserId),
    where('jobId', '==', jobId)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty;
};