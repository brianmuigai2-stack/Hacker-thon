import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';

export const uploadProfileImage = async (userId, file) => {
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `profile-images/${userId}/${Date.now()}_${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update user document with the image URL
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profileImage: downloadURL,
      updatedAt: new Date()
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};