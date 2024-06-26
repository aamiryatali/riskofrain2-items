import {auth, setAuthListeners, signIn, logout} from './auth.js';
import {deleteBuild, deleteBuildItem, getBuildItems, getBuilds, addToBuild, getFavorites, favorite, createBuild} from './data.js';
setAuthListeners(setLoggedInUI, setLoggedOutUI);
var buildItemName;
var currListValue;

function setLoggedInUI(){
  document.querySelector('#login-button').innerHTML = "Log out";
  document.querySelector('#login-button').onclick = logout;
  document.getElementById('login-dialog').style.display = 'none';
  document.querySelector('#build-page-content').style.display = "flex";
  document.querySelector('#logged-out-text').style.display = "none";
  showBuilds();
}

function setLoggedOutUI(){
  document.querySelector('#login-button').innerHTML = "Log in";
  document.querySelector('#login-button').onclick = showLoginDialog;
  document.querySelector('#build-page-content').style.display = "none";
  document.querySelector('#logged-out-text').style.display = "block";
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


function addFavorite(id, name){
  let user = auth.currentUser;
  if(user === null){
    alert("Please log in to add and view favorites!");
    return;
  }
  let uid = auth.currentUser.uid;
  favorite(uid, id, addToFavoritesPopup, name);
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
  document.body.appendChild(popup)
  setTimeout(function() {
    document.body.removeChild(popup);
  }, 3000);
}


async function showFavorites() {
  let user = auth.currentUser;
  if(user === null){
    alert("Please log in to add and view favorites!");
    return;
  }
  getFavorites(auth.currentUser.uid, drawCard);
}

//Shows the build dialog
async function showBuildDialog(itemID, itemName, itemImage){
  buildItemID = itemID;
  buildItemName = decodeURIComponent(itemName);
  var dialog = document.getElementById('build-dialog');
  var name = GetElementInsideContainer("build-dialog", "build-item-name");
  var image = GetElementInsideContainer("build-dialog", "build-item-image");
  var buttons = GetElementInsideContainer("build-dialog", "build-dialog-buttons");
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

//Dialog specifically for creating new builds
async function createNewBuildDialog(){
  var dialog = document.getElementById('build-dialog');
  dialog.style.display = "block";
}

//Actually makes a new build in the database
async function createNewBuild(){
  let buildName = document.querySelector("#new-build-name").value;
  let uid = auth.currentUser.uid;
  var dialog = document.getElementById('build-dialog');
  createBuild(uid, buildName);
  dialog.style.display = "none";
  showBuilds();
}

//Adds an item to the selected build
async function realAddToBuild(itemID){
  var itemAmt = document.querySelector('#build-item-newname').value;
  let uid = auth.currentUser.uid;
  addToBuild(uid, currListValue, itemID, itemAmt, buildItemName);
  document.querySelector('#build-dialog').style.display = "none";
}

function fixedEncodeURIComponent(src) {
  return encodeURIComponent(src).replace(/[']/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
  });
}

//Draws the list of stored builds on the page
async function drawBuilds(builds){
  var buildSection = document.querySelector('#build-section');
  buildSection.innerHTML = `<p style="text-align: left; margin-left: 20px;">Your builds:</p>`
  for(let build of builds){
      let encodedBuild = fixedEncodeURIComponent(`${build}`);
      buildSection.innerHTML += `
      <button class="build-button" onclick="showBuildItems('${encodedBuild}')">${build}</button>`
  }
}

//Draws the items in a stored build
async function drawBuildItems(buildItems){
  drawItems(buildItems);
}

//Actually displays the items in a build
async function showBuildItems(ebuildID){
  let buildID = decodeURIComponent(ebuildID);
  let itemSection = document.querySelector('#item-section');
  itemSection.innerHTML = `
  <p style="text-align: left; margin-left: 20px;">Visit the Items page to add items to this build!</p>
  <div>
  <button class="delete-build-button" onclick="deleteEntireBuild('${ebuildID}')">Delete Build</button>
  </div>`;
  getBuildItems(auth.currentUser.uid, buildID, drawBuildItems);
}

//Shows the list of stored builds
async function showBuilds(){
  let user = auth.currentUser;
  if(user === null){
    alert("Please log in to add and view favorites!");
    return;
  }
  await getBuilds(auth.currentUser.uid, drawBuilds);
}

//Deletes an entire build
async function deleteEntireBuild(buildID){
  await deleteBuild(auth.currentUser.uid, buildID);
  setTimeout(function(){
    showBuilds();
  }, 50);
  let result = document.querySelector('#item-section');
  result.innerHTML = '';
}

//Deletes a specific item from a build
async function deleteItem(buildID, buildItemID){
  await deleteBuildItem(auth.currentUser.uid, buildID, buildItemID);
  setTimeout(function(){
    showBuildItems(buildID);
  }, 50);
  
}


window.deleteEntireBuild = deleteEntireBuild;
window.deleteItem = deleteItem;
window.createNewBuildDialog = createNewBuildDialog;
window.showBuildItems = showBuildItems;
window.showBuildDialog = showBuildDialog;
window.realAddToBuild = realAddToBuild;
window.createNewBuild = createNewBuild;
window.addToFavoritesPopup = addToFavoritesPopup;
window.showFavorites = showFavorites;
window.addFavorite = addFavorite;
window.realSignIn = realSignIn;