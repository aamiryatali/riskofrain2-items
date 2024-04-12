import {auth, createUser, setAuthListeners, signIn, logout} from './auth.js';
  import {getFavorites, favorite} from './data.js';
  setAuthListeners(setLoggedInUI, setLoggedOutUI);

  function setLoggedInUI(){
    document.querySelector('#login-button').innerHTML = "Log out";
    document.querySelector('#login-button').onclick = logout;
    document.getElementById('login-dialog').style.display = 'none';
    showFavorites();
  }
  function setLoggedOutUI(){
    document.querySelector('#login-button').innerHTML = "Log in";
    document.querySelector('#login-button').onclick = showLoginDialog;
    document.querySelector('.container').innerHTML = `
    <p>Please log in to add and view favorites</p>`;
 }

  async function realSignIn(){
      let username = document.querySelector('#user').value;
      let password = document.querySelector('#pass').value;
      const user = await signIn(auth, username, password);
      //Shows error message even on successful login because
      //await is not doing what await should do :)
      if (user === null) {
          document.getElementById('error-message').style.display = 'block'; // Show error message
      }
  }

  async function addFavorite(id, name){
    let user = auth.currentUser;
    if(user === null){
      alert("Please log in to add and view favorites!");
      return;
    }
    let uid = auth.currentUser.uid;
    await favorite(uid, id, addToFavoritesPopup, name);
    console.log("got past favorite call");
    showFavorites();
  }

  function addToFavoritesPopup(itemName, isAlreadyAdded) {
     var popup = document.createElement('div');
     popup.style.position = 'fixed';
     popup.style.bottom = '20px';
     popup.style.left = '25%';
     popup.style.padding = '10px';
     popup.style.color = 'white';
     popup.style.borderRadius = '5px';

     if(isAlreadyAdded === "true"){
      popup.style.backgroundColor = 'red';
      popup.innerHTML = itemName + ' has been removed from favorites';
     } else {
      popup.style.backgroundColor = 'green';
      popup.innerHTML = itemName + ' has been added to favorites';
     }
     document.body.appendChild(popup);

     setTimeout(function() {
       document.body.removeChild(popup);
     }, 3000);
   }

  async function showFavorites() {
    let user = auth.currentUser;
    if(user === null){
      alert("Please log in to add and view favorites!");
      console.log("returning null");
      return;
    }
    getFavorites(auth.currentUser.uid, drawCard);
  }

  function search(favArr) {
    let searchKey = document.querySelector('#search-key').value;

    let results = [];
    if(searchKey === ""){
      showFavorites();
      return;
    }

    for (let rec of favArr) {
      let searchText = rec.itemName.toUpperCase();
      searchKey = searchKey.toUpperCase();

      if (searchText.search(searchKey) !== -1) {
        results.push(rec);
      }
      drawCard(results);
    }
  }

  document.querySelector("#search-key").onkeyup=function(){
      if(event.keyCode==13){
        let thing = getFavorites(auth.currentUser.uid, search);
        console.log(thing);
      }
  };
  
  window.addToFavoritesPopup = addToFavoritesPopup;
  window.showFavorites = showFavorites;
  window.addFavorite = addFavorite;
  window.realSignIn = realSignIn;