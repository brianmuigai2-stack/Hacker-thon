import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import dbData from '../data/db.json';

const categories = ['Cleaning', 'Construction', 'Delivery', 'Agriculture', 'Manufacturing', 'Retail', 'Healthcare', 'Security', 'Hospitality', 'Education'];

export const migrateJobsToFirebase = async () => {
  try {
    const { jobs, organizers } = dbData;
    
    for (const job of jobs) {
      const organizer = organizers.find(org => org.id === job.organizerId);
      
      await addDoc(collection(db, 'jobs'), {
        job_title: job.job_title,
        description: job.description,
        category: categories[Math.floor(Math.random() * categories.length)],
        location: organizer?.location || 'Nairobi',
        compensation_ksh: job.compensation_ksh,
        duration: job.duration,
        time_to_start: job.time_to_start,
        availability: job.availability,
        organizerId: `demo-org-${job.organizerId}`,
        organizerName: organizer?.name || 'Demo Organization',
        createdAt: new Date(),
        applicationsCount: 0
      });
    }
    
    console.log('Migration completed!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};