import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  updateDoc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const createJob = async (jobData) => {
  return await addDoc(collection(db, 'jobs'), {
    ...jobData,
    createdAt: new Date(),
    availability: 'Open',
    applicationsCount: 0
  });
};

export const getJobs = async (filters = {}) => {
  let q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  
  if (filters.category) {
    q = query(collection(db, 'jobs'), where('category', '==', filters.category), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  let jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Client-side filtering for search and salary
  if (filters.search) {
    jobs = jobs.filter(job => 
      job.job_title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  if (filters.minSalary) {
    jobs = jobs.filter(job => job.compensation_ksh >= filters.minSalary);
  }
  
  if (filters.location) {
    jobs = jobs.filter(job => 
      job.location?.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  return jobs;
};

export const getJobsByOrganizer = async (organizerId) => {
  const q = query(
    collection(db, 'jobs'), 
    where('organizerId', '==', organizerId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const applyToJob = async (jobId, userId, applicationData) => {
  const application = {
    jobId,
    userId,
    ...applicationData,
    status: 'pending',
    appliedAt: new Date()
  };
  
  const docRef = await addDoc(collection(db, 'applications'), application);
  
  // Update job applications count
  const jobRef = doc(db, 'jobs', jobId);
  const jobDoc = await getDoc(jobRef);
  if (jobDoc.exists()) {
    await updateDoc(jobRef, {
      applicationsCount: (jobDoc.data().applicationsCount || 0) + 1
    });
  }
  
  return docRef;
};

export const getApplicationsByUser = async (userId) => {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return apps.sort((a, b) => {
    const dateA = a.appliedAt?.seconds || 0;
    const dateB = b.appliedAt?.seconds || 0;
    return dateB - dateA;
  });
};

export const getApplicationsByJob = async (jobId) => {
  const q = query(
    collection(db, 'applications'),
    where('jobId', '==', jobId)
  );
  const snapshot = await getDocs(q);
  const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return apps.sort((a, b) => {
    const dateA = a.appliedAt?.seconds || 0;
    const dateB = b.appliedAt?.seconds || 0;
    return dateB - dateA;
  });
};

export const updateApplicationStatus = async (applicationId, status) => {
  const appRef = doc(db, 'applications', applicationId);
  await updateDoc(appRef, { status });
};

export const withdrawApplication = async (applicationId, jobId) => {
  // Delete application
  const appRef = doc(db, 'applications', applicationId);
  await deleteDoc(appRef);
  
  // Update job applications count
  const jobRef = doc(db, 'jobs', jobId);
  const jobDoc = await getDoc(jobRef);
  if (jobDoc.exists()) {
    const currentCount = jobDoc.data().applicationsCount || 0;
    await updateDoc(jobRef, {
      applicationsCount: Math.max(0, currentCount - 1)
    });
  }
};

export const updateJob = async (jobId, jobData) => {
  const jobRef = doc(db, 'jobs', jobId);
  await updateDoc(jobRef, {
    ...jobData,
    updatedAt: new Date()
  });
};

export const deleteJob = async (jobId) => {
  const jobRef = doc(db, 'jobs', jobId);
  await deleteDoc(jobRef);
  
  // Delete all applications for this job
  const appsQuery = query(
    collection(db, 'applications'),
    where('jobId', '==', jobId)
  );
  const appsSnapshot = await getDocs(appsQuery);
  const deletePromises = appsSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};