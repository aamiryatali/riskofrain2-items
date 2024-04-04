import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, 
  signInAnonymously, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const user = auth.currentUser;

function setAuthListeners(setLoggedInUI){
  onAuthStateChanged(auth, user => {
    if (user) {
      setLoggedInUI();
      const uid = user.id;
      console.log("signed in");
      console.log(uid);
    } else {
      console.log("not signed in");
    }
  });
}

async function createUser(auth, email, password){
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  return auth.currentUser;
}

async function signIn(auth, email, password){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  return auth.currentUser;
}

async function logout() {
 /* try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
  }
*/
    signOut(auth).then(() => {
        // Sign-out successful.
        }).catch((error) => {
        // An error happened.
    });
}

export {auth, createUser, setAuthListeners, signIn, logout, signInWithEmailAndPassword};
