import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDoc, addDoc, getDocs, deleteDoc, doc, setDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createBuild(uid, buildName){
    console.log("inside createBuild");
    await setDoc(doc(db, `/users/${uid}/builds/`, `${buildName}`), {
            emptyItem: {
                amount: 0,
                itemID: "null"
            }
      });
}

async function addToBuild(uid, buildID, itemID, itemAmt){
    console.log("in addToBuild");
    const builddb = collection(db, `/users/${uid}/builds/${buildID}/items/`);
    const buildDocs = await getDocs(builddb);
    const buildItems = [];
    buildDocs.forEach((doc) => {
       /* if(doc.data().itemID === itemID){
            deleteDoc(doc.ref)
            found = true;
        } else {*/
            buildItems.push(doc.data());
        //}
    });

    const obj = {
        amount: itemAmt,
        itemID: itemID
    };

    /*if(found === true){
        return;
    }*/
    console.log("logging build items");
    console.log(buildItems);
    addDoc(collection(db, `/users/${uid}/builds/${buildID}/items/`), obj);
}

async function getBuilds(uid, doFunction){
    const builddb = collection(db, `/users/${uid}/builds/`);
    const buildDocs = await getDocs(builddb);
    const builds = [];
    buildDocs.forEach((doc) => {
            builds.push(doc.id);
            
    });
    console.log("logging build names");
    console.log(builds);
    doFunction(builds);
}

async function getFavorites(uid, doFunction){
    const favdb = collection(db, `/users/${uid}/favorites`);
    const favDocs = await getDocs(favdb);
    const favorites = [];
    favDocs.forEach((doc) => {
            favorites.push(doc.data());
            
    });

    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    const data = await response.json();
    let favItems = [];
    for(let rec of favorites){
      for(let item of data){
        if(rec.itemID === item._id){
            favItems.push(item);
        }
      }
    }
    doFunction(favItems);
    return favItems;
}

async function favorite(uid, id, addToFavoritesPopup, name){
    const favdb = collection(db, `/users/${uid}/favorites`);
    const favDocs = await getDocs(favdb);
    const favorites = [];
    let found = false;
    favDocs.forEach((doc) => {
            if(doc.data().itemID === id){
                addToFavoritesPopup(name, "true");
                deleteDoc(doc.ref)
                found = true;
            } else {
                favorites.push(doc.data());
            }
    });
    
    if(found === true){
        return;
    }

    addToFavoritesPopup(name, "false");
    const obj = {
      itemID: id
    };
    addDoc(collection(db, `/users/${uid}/favorites`), obj);
  }

export {getBuilds, addToBuild, createBuild, getFavorites, favorite} ;
