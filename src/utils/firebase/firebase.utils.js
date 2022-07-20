import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj0e1pOvW_rB1CWoagXdYQ-7zDm8l2S6A",
  authDomain: "crwn-clothing-db-d7336.firebaseapp.com",
  projectId: "crwn-clothing-db-d7336",
  storageBucket: "crwn-clothing-db-d7336.appspot.com",
  messagingSenderId: "653607175150",
  appId: "1:653607175150:web:ea919c0e582e7e775e04ff",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid); // Creating user document reference, take 3 arguments, the database, collection name and document unique id.

  const userSnapshot = await getDoc(userDocRef);

  //If user data does not exist
  //create or set the document with the data from userAuth in my collection.
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  //If user data exists
  //return userDocRef.
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
