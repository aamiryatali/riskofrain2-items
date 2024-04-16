let state = [];

function showLoginDialog() {
  var dialog = document.getElementById('login-dialog');
  dialog.style.display = 'block';
}

function fixedEncodeURIComponent(src) {
  return encodeURIComponent(src).replace(/[']/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
  });
}

//Draws the items on the screen and adds colored borders respective to their
//rarity.
function drawItems(records){
  let result = document.querySelector('#item-section');
  let buildID = fixedEncodeURIComponent(records[0].buildID);
  let html = `
  <button class="delete-build-button" onclick="deleteEntireBuild('${buildID}')">Delete Build</button>
  <div id="vl"></div>`;
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Common'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName} x${rec.amount}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Uncommon'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid #00c853;" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName} x${rec.amount}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Legendary'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName} x${rec.amount}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Boss'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName} x${rec.amount}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Lunar'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid #80d8ff;" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName} x${rec.amount}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Void'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid #d500f9;" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName} x${rec.amount}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  for(let rec of records){
    let buildID = fixedEncodeURIComponent(rec.buildID);
    if(rec.rarity === 'Equipment'){
      html += `<div class="item-container">
                  <img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')">
                  <p>${rec.itemName}</p>
                  <img src="https://cdn.discordapp.com/attachments/416336627317866500/1228483408242409590/Untitled.png?ex=662c3554&is=6619c054&hm=9fd4095819da27ef957c95c1b9feccd6c69dddb2c173e6bf241d23a5e3a18e8f&" class="trash-icon" onclick="deleteItem('${buildID}', '${rec._id}')">
               </div>`;
    }
  }
  result.innerHTML = html;
}

async function getData() {
  const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
  state = await response.json();
}

//Shows the item description on the build page
async function itemDesc(item){
  await getData();

  let result = document.querySelector('#vl');
  result.style.display = 'flex';
  
  let html = '';

  for(let rec of state){
      if(rec._id === item){
          html += `<div id="item-description">
          <p style="font-size: 20px; font-family: 'Bungee Spice', cursive;">${rec.itemName}</p>
  <img src="${rec.itemImage}" alt="${rec.itemName}">
  <br>
  <hr style="width: 100%">
  <br>
  <p>Item Description:</p>
  <p>${rec.description}</p>

  <p>Stack Type:</p>
  <p>${rec.stackType}</p>
<\v>`;
      }
  }
  result.innerHTML = html;
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

window.GetElementInsideContainer = GetElementInsideContainer;
window.itemDesc = itemDesc;
window.drawItems = drawItems;
