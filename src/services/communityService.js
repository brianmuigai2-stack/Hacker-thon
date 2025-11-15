import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllUsers = async (currentUserId, userType = null) => {
  try {
    let q = query(collection(db, 'users'));
    
    if (userType) {
      q = query(collection(db, 'users'), where('type', '==', userType));
    }
    
    const snapshot = await getDocs(q);
    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== currentUserId); // Exclude current user
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};