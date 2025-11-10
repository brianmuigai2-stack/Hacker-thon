import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const createNotification = async (notificationData) => {
  try {
    const notification = {
      ...notificationData,
      read: false,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notification);
    return docRef;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const sendApplicationStatusNotification = async (
  userId, 
  jobTitle, 
  status, 
  additionalMessage = ''
) => {
  const titles = {
    accepted: ' Application Accepted!',
    rejected: 'Application Update',
    pending: 'Application Received'
  };

  const messages = {
    accepted: `Great news! Your application for "${jobTitle}" has been accepted.`,
    rejected: `Your application for "${jobTitle}" was not successful this time.`,
    pending: `Your application for "${jobTitle}" has been received and is under review.`
  };

  return await createNotification({
    userId,
    type: status,
    title: titles[status],
    message: messages[status],
    additionalMessage,
    jobTitle
  })
}