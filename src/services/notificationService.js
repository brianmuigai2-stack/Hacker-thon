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
    // Ensure all fields are present and properly formatted
    const notification = {
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      jobTitle: notificationData.jobTitle,
      additionalMessage: notificationData.additionalMessage !== undefined && notificationData.additionalMessage !== null 
        ? String(notificationData.additionalMessage) 
        : '',
      read: false,
      createdAt: new Date()
    };
    
    console.log(' Creating notification with data:', notification);
    
    const docRef = await addDoc(collection(db, 'notifications'), notification);
    console.log(' Notification created successfully with ID:', docRef.id);
    
    return docRef;
  } catch (error) {
    console.error(' Error creating notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId) => {
  try {
    console.log(' Fetching notifications for user:', userId);
    
    // Query WITHOUT orderBy to avoid index requirement
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log(' Notification data:', { id: doc.id, ...data });
      return { 
        id: doc.id, 
        ...data
      };
    });
    
    // Sort on client side instead
    notifications.sort((a, b) => {
      const dateA = a.createdAt?.seconds || a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.seconds || b.createdAt?.getTime() || 0;
      return dateB - dateA; // Newest first
    });
    
    console.log(` Fetched ${notifications.length} notifications`);
    
    return notifications;
  } catch (error) {
    console.error(' Error fetching notifications:', error);
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
    console.log(' Marked notification as read:', notificationId);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const sendApplicationStatusNotification = async (
  userId, 
  jobTitle, 
  status, 
  additionalMessage
) => {
  console.log('sendApplicationStatusNotification called with:', {
    userId,
    jobTitle,
    status,
    additionalMessage,
    additionalMessageType: typeof additionalMessage,
    additionalMessageLength: additionalMessage ? additionalMessage.length : 0
  });

  const titles = {
    accepted: ' Application Accepted!',
    rejected: ' Application Update',
    pending: ' Application Received'
  };

  const messages = {
    accepted: `Great news! Your application for "${jobTitle}" has been accepted.`,
    rejected: `Thank you for your interest in "${jobTitle}". Unfortunately, your application was not successful this time.`,
    pending: `Your application for "${jobTitle}" has been received and is under review.`
  };

  // CRITICAL: Ensure additionalMessage is always a string
  const finalAdditionalMessage = (additionalMessage !== null && additionalMessage !== undefined) 
    ? String(additionalMessage).trim() 
    : '';

  console.log(' Final additional message:', {
    original: additionalMessage,
    final: finalAdditionalMessage,
    isEmpty: finalAdditionalMessage === ''
  });

  const notificationData = {
    userId: userId,
    type: status,
    title: titles[status] || 'Notification',
    message: messages[status] || 'You have a new notification',
    additionalMessage: finalAdditionalMessage,
    jobTitle: jobTitle
  };

  console.log(' Complete notification data being sent:', notificationData);

  try {
    const result = await createNotification(notificationData);
    console.log(' Notification sent successfully');
    return result;
  } catch (error) {
    console.error(' Failed to send notification:', error);
    throw error;
  }
};