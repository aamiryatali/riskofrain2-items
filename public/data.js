import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDoc, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function getBooks(renderFun){
    let response = await fetch('/books.json');
    let books = await response.json();
    renderFun(books);
}

async function getFavorites(uid, drawCard){
    console.log("in getfavorites");
    const favdb = collection(db, `/users/${uid}/favorites`);
    const favDocs = await getDocs(favdb);
    const favorites = [];
    favDocs.forEach((doc) => {
            favorites.push(doc.data());
            
    });

    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    const data = await response.json();
    let favItems = [];
    console.log("Favorites coming up");
    console.log(favorites);
    for(let rec of favorites){
      console.log(rec.id);
      for(let item of data){
        if(rec.id === item._id){
            favItems.push(item);
        }
      }
    }
    console.log("Fav Items coming up");
    console.log(favItems);
    drawCard(favItems);
}

async function createReview(auth, isbn, text){
    const reviewData = {
        isbn: isbn,
        text: text,
        userId: auth.currentUser.uid,
        reviewer: "yeah"
    };
    console.log(reviewData);
    addDoc(collection(db, `users/${auth.currentUser.uid}/reviews`), reviewData)
}

async function deleteReview(auth, reviewId){
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewDoc = await getDoc(reviewRef);
    
    if (reviewDoc.exists() && reviewDoc.data().userId === auth.currentUser.uid) {
        await deleteDoc(reviewRef);
        console.log("Review deleted successfully");
        return true;
    } else {
        console.log("Review not found or you don't have permission to delete it");
        return false;
    }
}

async function favorite(uid, id, addToFavoritesPopup, name){
    const favdb = collection(db, `/users/${uid}/favorites`);
    const favDocs = await getDocs(favdb);
    const favorites = [];
    favDocs.forEach((doc) => {
            favorites.push(doc.data());
    });
    for(let fav of favorites){
        if(fav.id === id){
            addToFavoritesPopup(name, "true");
            return;
        }
    }

    addToFavoritesPopup(name, "false");
    const obj = {
      id: id
    };
    addDoc(collection(db, `/users/${uid}/favorites`), obj);
  }

export {getBooks, getFavorites, createReview, deleteReview, favorite} ;
