import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase';

export const createJob = async (jobData) => {
  return await addDoc(collection(db, 'jobs'), {
    ...jobData,
    createdAt: new Date(),
    availability: 'Open'
  });
};

export const getJobs = async () => {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getJobsByOrganizer = async (organizerId) => {
  const q = query(
    collection(db, 'jobs'), 
    where('organizerId', '==', organizerId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};