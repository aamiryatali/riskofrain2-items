import {auth, createUser, setAuthListeners, signIn, logout} from './auth.js';
  import {getBuilds, addToBuild, getFavorites, favorite, createBuild} from './data.js';
  setAuthListeners(setLoggedInUI, setLoggedOutUI);
  var buildItemID;
  var buildItemName;
  var buildItemImage;
  var currListValue;
  
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
    <p style="text-align: center; margin: 1em; font-size: 20px; font-family: 'Aldrich'">Log in to add and view favorites!</p>`;
 }

  async function realSignIn(){
      let username = document.querySelector('#user').value;
      let password = document.querySelector('#pass').value;
      const user = await signIn(auth, username, password);
      
      setTimeout(function(){
        if (user === null) {
          document.getElementById('error-message').style.display = 'block'; // Show error message
        }
      }, 1500);
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
  
  async function showBuildDialog(itemID, itemName, itemImage){
    console.log('show');
    buildItemID = itemID;
    buildItemName = decodeURIComponent(itemName);
    buildItemImage = itemImage;
    var dialog = document.getElementById('build-dialog');
    var name = GetElementInsideContainer("build-dialog", "build-item-name");
    var image = GetElementInsideContainer("build-dialog", "build-item-image");
    var buttons = GetElementInsideContainer("build-dialog", "build-dialog-buttons");
    var input = GetElementInsideContainer("build-dialog", "build-dialog-input");

    buttons.innerHTML = `
        <button style="background-color: #ff6f61; color: white;" onclick="document.getElementById('build-dialog').style.display='none'">Cancel</button>
        <button style="background-color: #98ff98; color: black;" onclick="realAddToBuild('${itemID}')">Confirm</button>
    `;
    let uid = auth.currentUser.uid;
    getBuilds(uid, listBuilds);
    
    
    name.innerHTML = `${buildItemName}`;
    image.src = `${itemImage}`;
    dialog.style.display = 'block';
  }

  async function createNewBuildDialog(){
    var name = GetElementInsideContainer("build-dialog", "build-item-name");
    var image = GetElementInsideContainer("build-dialog", "build-image-section");
    var input = GetElementInsideContainer("build-dialog", "build-dialog-input");
    var buttons = GetElementInsideContainer("build-dialog", "build-dialog-buttons");
    name.style.display = "none";
    image.style.display = "none";
    input.innerHTML = `
      <p>Enter new build name</p>
      <input type="text" id="build-item-newname">
    `;
    
    buttons.innerHTML = `
        <button style="background-color: #ff6f61; color: white;" onclick="showBuildDialog()">Cancel</button>
        <button style="background-color: #98ff98; color: black;" onclick="createNewBuild()">Confirm</button>
    `;
  }

  async function checkValue(event){
    if(event.target.value === "createBuild"){
      createNewBuildDialog();
    } else {
      var list = document.getElementById('build-list');
      currListValue = list.options[list.selectedIndex].value;
      console.log("currListValue changed to: ");
      console.log(currListValue);
      var name = GetElementInsideContainer("build-dialog", "build-item-name");
      var image = GetElementInsideContainer("build-dialog", "build-image-section");
      var input = GetElementInsideContainer("build-dialog", "build-dialog-input");
      input.innerHTML = `
      <p>Amount</p>
      <input type="number" id="build-item-newname" value="1">
      `;
      name.style.display = "flex";
      image.style.display = "flex";
    }
  }

  async function listBuilds(builds){
    var list = GetElementInsideContainer("build-dialog", "build-list");
    list.innerHTML = `<option value="empty">Please select build</option>`;
    for(let build of builds){
      list.innerHTML += `
        <option value="${build}">${build}</option>
      `;
    }
    list.innerHTML += `
    <option value="createBuild" onclick="createNewBuildDialog()">Create New Build</option>`;
  }

  async function createNewBuild(){
    let buildName = document.querySelector("#build-item-newname").value;
    let uid = auth.currentUser.uid;
    var list = document.getElementById('build-list');
    var name = GetElementInsideContainer("build-dialog", "build-item-name");
    var image = GetElementInsideContainer("build-dialog", "build-image-section");
    var input = GetElementInsideContainer("build-dialog", "build-dialog-input");

    createBuild(uid, buildName);
    input.innerHTML = `
    <p>Amount</p>
    <input type="text" id="build-item-newname">
    `;

    list.value = `${buildName}`;
    name.style.display = "flex";
    image.style.display = "flex";
    showBuildDialog(buildItemID, buildItemName, buildItemImage);
  }

  async function realAddToBuild(itemID){
    var itemAmt = document.querySelector('#build-item-newname').value;
    console.log("printing iewftem amiunt");
    console.log(itemAmt);
    let uid = auth.currentUser.uid;
    addToBuild(uid, currListValue, itemID, itemAmt);
    document.querySelector('#build-dialog').style.display = "none";
  }

  window.checkValue = checkValue;
  window.showBuildDialog = showBuildDialog;
  window.realAddToBuild = realAddToBuild;
  window.createNewBuild = createNewBuild;
  window.addToFavoritesPopup = addToFavoritesPopup;
  window.showFavorites = showFavorites;
  window.addFavorite = addFavorite;
  window.realSignIn = realSignIn;