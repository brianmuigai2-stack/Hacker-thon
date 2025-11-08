import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateUserProfile = async (userId, profileData) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: new Date()
  });
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
};