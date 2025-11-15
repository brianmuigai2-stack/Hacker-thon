import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

export const sendMessage = async (senderId, receiverId, message, jobId = null) => {
  return await addDoc(collection(db, 'messages'), {
    senderId,
    receiverId,
    message,
    jobId,
    timestamp: new Date(),
    read: false
  });
};

export const getConversation = async (userId1, userId2) => {
  const q = query(
    collection(db, 'messages'),
    where('senderId', 'in', [userId1, userId2]),
    where('receiverId', 'in', [userId1, userId2]),
    orderBy('timestamp', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserConversations = async (userId) => {
  const q1 = query(collection(db, 'messages'), where('senderId', '==', userId));
  const q2 = query(collection(db, 'messages'), where('receiverId', '==', userId));
  
  const [sent, received] = await Promise.all([getDocs(q1), getDocs(q2)]);
  
  const conversations = new Map();
  [...sent.docs, ...received.docs].forEach(doc => {
    const data = doc.data();
    const otherUserId = data.senderId === userId ? data.receiverId : data.senderId;
    if (!conversations.has(otherUserId) || conversations.get(otherUserId).timestamp < data.timestamp) {
      conversations.set(otherUserId, { id: doc.id, ...data });
    }
  });
  
  return Array.from(conversations.values());
};