let state = []; //Global array to hold API items
let filtered = [];
function showLoginDialog() {
    var dialog = document.getElementById('login-dialog');
    dialog.style.display = 'block';
    document.getElementById('error-message').style.display = 'none'; // Hide error message initially
}
 

function GetElementInsideContainer(containerID, childID) {
  var elm = {};
  var elms = document.getElementById(containerID).getElementsByTagName("*");
  for (var i = 0; i < elms.length; i++) {
      if (elms[i].id === childID) {
          elm = elms[i];
          break;
      }
  }
  return elm;
}

//Draws the data on the screen and adds colored borders respective to their
//rarity. Done so inefficiently in order to sort the colours properly.
function drawCard(records){
    let result = document.querySelector('.container');
    let html = '';

    for(let rec of records){
      if(rec.rarity === 'Common'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">`;
      }
    }
    for(let rec of records){
      if(rec.rarity === 'Uncommon'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid #00c853;" onclick="itemDesc('${rec._id}')">`;
      }
    }
    for(let rec of records){
      if(rec.rarity === 'Legendary'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">`;
      }
    }
    for(let rec of records){
      if(rec.rarity === 'Boss'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">`;
      }
    }
    for(let rec of records){
      if(rec.rarity === 'Lunar'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid #80d8ff;" onclick="itemDesc('${rec._id}')">`;
      }
    }
    for(let rec of records){
      if(rec.rarity === 'Void'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid #d500f9;" onclick="itemDesc('${rec._id}')">`;
      }
    }
    for(let rec of records){
      if(rec.rarity === 'Equipment'){
        html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">`;
      }
    }

    //This particular line adds a very special cat to the gallery
    let searchKey = document.querySelector('#search-key').value;
    if(searchKey === '' && filtered.length === 0){
    html += `<img onclick="itemDesc('vro')" src="https://cdn.discordapp.com/attachments/349291858393825291/1225338403281698928/image.png?ex=6620c451&is=660e4f51&hm=07c064fe08c874a18b0c0994823292b3d35319d7064cc64c8319ffb745aa0c0c&" style="border: 2px solid saddlebrown;">`;
    }
    result.innerHTML = html;
}

//Gets the data from the API
async function getData() {
    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    const data = await response.json();
    return data;
}

//Draws the items on the page
async function showItems() {
    state = await getData();
    drawCard(state);
}

showItems();

//Function to filter by item rarity
function filterBy(filter){
  filtered = [];
  if(filter === 'All'){
    return drawCard(state);
  }

  
  for (let rec of state) {
    if (rec.rarity === filter)
      filtered.push(rec);
  }

  drawCard(filtered);
}

//This function replaces apostophes with their UTF-8 equivalents.
//The only reason we needed this is because some of the names in the API
//contained an apostrophe, and in the itemDesc function below, that would
//cause certain strings to end early in an onclick function. And we had already
//used a `, " and ' so we needed to find a way to pass the name without
//having any quotes in it. The name would then be decoded 
//inside the function it was passed to.
function fixedEncodeURIComponent(src) {
  return encodeURIComponent(src).replace(/[']/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
  });
}

//Draws the item description on the left 
function itemDesc(item){
    let result = document.querySelector('#item-desc');
    document.querySelector('.container').style['margin-left'] = '25%';
    let html = '';

    //This statement checks for a certain cat
    if(item === "vro"){
      html += `<div id="full-page-element">
      <button onclick="closeItemDesc()" class="x">X</button>
      <br><br>
  
      <p style="font-size: 20px; font-family: 'Bungee Spice', cursive;">Vro</p>
      <img src="https://media1.tenor.com/m/t6VAu8neEjkAAAAd/cat-vro.gif" alt="Vro">
      <br>
      <hr style="width: 100%">
      <br>
      <p>Cat Description:</p>
      <p>This is Vro. She was instrumental in the development of this webpage and what you see before you would not be possible without her help. And her meow was electric....</p>
  
      <p>Stack Type:</p>
      <p>vro</p>
      </div>`
    } else { //This code actually does what the website is supposed to do
      for(let rec of state){
        if(rec._id === item){
          var itemName = fixedEncodeURIComponent(`${rec.itemName}`);
          html += `<div id="full-page-element">
          <button onclick="closeItemDesc()" class="x">X</button>
          <br><br>
          <p style="font-size: 20px; font-family: 'Bungee Spice', cursive;">${rec.itemName}</p>
          <img src="${rec.itemImage}" alt="${rec.itemName}">
          <br>
          <hr style="width: 100%">
          <br>
          <p>Item Description:</p>
          <p>${rec.description}</p>
          <p>Stack Type:</p>
          <p>${rec.stackType}</p>
          <div class="bottom-buttons">
              <button class="build-button" onclick="showBuildDialog('${rec._id}', '${itemName}', '${rec.itemImage}')"></button>
              <button class="favorite-button" onclick="addFavorite('${rec._id}', '${itemName}')"></button>
          </div>
          </div>`;
        }
      } 
    }

    //The onclick="showBuildDialog('${rec.itemName}')" was what did not work when the name
    //had an ' in it.
    result.innerHTML = html;
}

//Search function
function search() {
  let searchKey = document.querySelector('#search-key').value;
  let results = [];

  for (let rec of state) {
    let searchText = rec.itemName.toUpperCase();
    searchKey = searchKey.toUpperCase();
    if (searchText.search(searchKey) !== -1) {
      results.push(rec);
    }
    drawCard(results);
  }
}

//Function to close the description box
function closeItemDesc() {
    document.querySelector('#item-desc').innerHTML = '';
    document.querySelector('.container').style['margin-left'] = '0%';
}


//Hides the login dialog if you click off it.
document.body.addEventListener('click', function(event) {
    var dialog = document.getElementById('login-dialog');
    if (!dialog.contains(event.target) && event.target !== document.getElementById('login-button')) {
        dialog.style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }
});

document.querySelector("#search-key").onkeyup=function(){
  if(event.keyCode==13){
    search();
  }
};