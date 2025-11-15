import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const uploadProfileImage = async (userId, file) => {
  try {
    // Convert image to base64 and store in Firestore
    const base64 = await convertToBase64(file);
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profileImage: base64,
      updatedAt: new Date()
    });
    return base64;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed. Please try again.');
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};