import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const createNotification = async (userId, title, message, type = 'info', jobId = null, additionalMessage = null) => {
  return await addDoc(collection(db, 'notifications'), {
    userId,
    title,
    message,
    type, // 'info', 'success', 'warning', 'error'
    jobId,
    additionalMessage,
    read: false,
    createdAt: new Date()
  });
};

export const getUserNotifications = async (userId) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return notifications.sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return dateB - dateA;
  });
};

export const markNotificationAsRead = async (notificationId) => {
  const notifRef = doc(db, 'notifications', notificationId);
  await updateDoc(notifRef, { read: true });
};

export const sendJobApplicationNotification = async (employerId, jobTitle, applicantName) => {
  await createNotification(
    employerId,
    'New Job Application',
    `${applicantName} applied for ${jobTitle}`,
    'info'
  );
};

export const sendApplicationStatusNotification = async (applicantId, jobTitle, status, additionalMessage = null) => {
  const title = status === 'accepted' ? 'Application Accepted!' : 'Application Update';
  const message = status === 'accepted' 
    ? `Congratulations! Your application for ${jobTitle} has been accepted.`
    : `Your application for ${jobTitle} has been ${status}.`;
  
  await createNotification(applicantId, title, message, status === 'accepted' ? 'success' : 'info', null, additionalMessage);
};

// Browser notification (if permission granted)
export const showBrowserNotification = (title, message) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/vite.svg'
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const getUnreadNotifications = async (userId) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return notifications.sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return dateB - dateA;
  });
};