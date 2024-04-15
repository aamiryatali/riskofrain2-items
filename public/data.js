import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Creates a new build
async function createBuild(uid, buildName){
    await setDoc(doc(db, `/users/${uid}/builds`, `${buildName}`), {
        emptyItem: {
            amount: 0,
             itemID: "null"
        }
    });
}

//Adds an item to a build or updates an already added item
async function addToBuild(uid, buildID, itemID, itemAmt){
    let found = false;
    const builddb = collection(db, `/users/${uid}/builds/${buildID}/items`);
    const buildDocs = await getDocs(builddb);
    buildDocs.forEach((doc) => {
       if(doc.data().itemID === itemID){
            updateDoc(doc.ref, { //Update the amount if item already in build
                amount: itemAmt
            });
            found = true;
        }
    });

    if(found === true){
        return;
    }

    const obj = { //Otherwise add new item to build
        amount: itemAmt,
        itemID: itemID
    };
    addDoc(collection(db, `/users/${uid}/builds/${buildID}/items`), obj);
}

//Deletes an item from a build
async function deleteBuildItem(uid, buildID, buildItemID){
    const builddb = collection(db, `/users/${uid}/builds/${buildID}/items`);
    const buildDocs = await getDocs(builddb);
    buildDocs.forEach((doc) => {
            if(doc.data().itemID === buildItemID){
                deleteDoc(doc.ref);
            } 
    });
}

//Deletes all items in build, then deletes the build itself
async function deleteBuild(uid, buildID){
    const builddb = collection(db, `/users/${uid}/builds/${buildID}/items`);
    const buildDocs = await getDocs(builddb);
    buildDocs.forEach((doc) => {
            deleteDoc(doc.ref); //Delete all items
    });

    const buildlist = collection(db, `/users/${uid}/builds`);
    const builds = await getDocs(buildlist);
    builds.forEach((doc) => {
            if(doc.id === buildID){
                deleteDoc(doc.ref); //Delete build
            } 
    });
}

//Grab all items in a certain build, store them in an array, then
//do a function on that array.
async function getBuildItems(uid, buildID, doFunction){
    const builddb = collection(db, `/users/${uid}/builds/${buildID}/items`);
    const buildDocs = await getDocs(builddb);
    const buildDBItems= [];
    buildDocs.forEach((doc) => {
            buildDBItems.push(doc.data());
            
    });

    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    const data = await response.json();
    let buildItems = [];
    for(let rec of buildDBItems){
      for(let item of data){ //Grab the actual items from the API and store in array
        if(rec.itemID === item._id){
            item["amount"] = rec.amount; //Add an amount field to the item
            item["buildID"] = buildID; //Add a buildID field to the item
            buildItems.push(item); 
        }
      }
    }
    doFunction(buildItems);
    return buildItems; 
}

//Get list of stored builds
async function getBuilds(uid, doFunction){
    const builddb = collection(db, `/users/${uid}/builds`);
    const buildDocs = await getDocs(builddb);
    const builds = [];
    buildDocs.forEach((doc) => {
            builds.push(doc.id);
            
    });
    doFunction(builds);
}

//Get all favorites
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
      for(let item of data){ //Get the actual items from the API
        if(rec.itemID === item._id){
            favItems.push(item);
        }
      }
    }
    doFunction(favItems);
    return favItems;
}

// Add/remove a favorite item
async function favorite(uid, id, addToFavoritesPopup, name){
    const favdb = collection(db, `/users/${uid}/favorites`);
    const favDocs = await getDocs(favdb);
    const favorites = [];
    let found = false;
    favDocs.forEach((doc) => {
        if(doc.data().itemID === id){ //If item already added
            addToFavoritesPopup(name, "true");
            deleteDoc(doc.ref) //then remove item from favorites
            found = true;
        } else {
            favorites.push(doc.data()); //otherwise add item to favorites
        }
    });
    
    if(found === true){
        return;
    }

    addToFavoritesPopup(name, "false"); //Show the confirmation popup
    const obj = {
      itemID: id
    };
    addDoc(collection(db, `/users/${uid}/favorites`), obj);
}

export {deleteBuild, deleteBuildItem, getBuildItems, getBuilds, addToBuild, createBuild, getFavorites, favorite} ;
