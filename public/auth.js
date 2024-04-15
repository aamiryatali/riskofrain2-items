import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const user = auth.currentUser;

function setAuthListeners(setLoggedInUI, setLoggedOutUI){
  onAuthStateChanged(auth, user => {
    if (user) {
      setLoggedInUI();
      const uid = user.id;
    } else {
      setLoggedOutUI();
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
  signOut(auth).then(() => {
    }).catch((error) => {
  });
}

export {auth, createUser, setAuthListeners, signIn, logout, signInWithEmailAndPassword};
