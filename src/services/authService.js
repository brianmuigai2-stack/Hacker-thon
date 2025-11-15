import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const signUp = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    ...userData,
    email,
    createdAt: new Date()
  });
  return userCredential.user;
};

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  return { uid: userCredential.user.uid, ...userDoc.data() };
};

export const logout = () => signOut(auth);

export const signInWithGoogle = async (userType) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Validate email domain
  const { validateEmailStrength } = await import('../utils/emailValidator');
  const emailValidation = validateEmailStrength(user.email);
  
  if (!emailValidation.valid) {
    await auth.signOut();
    throw new Error(emailValidation.message);
  }
  
  // Check if user exists in Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      email: user.email,
      type: userType,
      location: '',
      createdAt: new Date()
    });
  }
  
  const userData = userDoc.exists() ? userDoc.data() : {
    name: user.displayName,
    email: user.email,
    type: userType,
    location: ''
  };
  
  return { uid: user.uid, ...userData };
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);