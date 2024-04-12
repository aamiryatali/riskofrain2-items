function showLoginDialog() {
    var dialog = document.getElementById('login-dialog');
    dialog.style.display = 'block';
    document.getElementById('error-message').style.display = 'none'; // Hide error message initially
}

let state = [];

async function getData() {
    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    state = await response.json();
}

getData();

function itemDesc(item){
    let result = document.querySelector('#item-desc');
    document.querySelector('.container').style['margin-left'] = '25%';
    let html = '';

    for(let rec of state){
        if(rec._id === item){
            html += `<div id="full-page-element">
  <button onclick="closeItemDesc()" class="x">X</button>
  <br><br>
  <p>${rec.itemName}</p>
  <img src="${rec.itemImage}" alt="${rec.itemName}">
  <p>Item Description:</p>
  <p>${rec.description}</p>
  <p>Stack Type:</p>
  <p>${rec.stackType}</p>
  <div class="bottom-buttons">
      <button class="build-button"></button>
      <button class="favorite-button" onclick="addFavorite('${rec._id}', '${rec.itemName}')"></button>
  </div>
</div>`;
        }
    }
    result.innerHTML = html;
}


function closeItemDesc() {
    document.querySelector('#item-desc').innerHTML = '';
    document.querySelector('.container').style['margin-left'] = '0%';
}

document.body.addEventListener('click', function(event) {
    var dialog = document.getElementById('login-dialog');
    if (!dialog.contains(event.target) && event.target !== document.getElementById('login-button')) {
        dialog.style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }
})

function drawCard(records){
  console.log("draw cards called");
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

    html += `<img onclick="window.location.href='Vro.html' "src="https://cdn.discordapp.com/attachments/349291858393825291/1225338403281698928/image.png?ex=6620c451&is=660e4f51&hm=07c064fe08c874a18b0c0994823292b3d35319d7064cc64c8319ffb745aa0c0c&" style="border: 2px solid orange;">`
    result.innerHTML = html;
}


function filterBy(filter){
    if(filter === 'All'){
        return drawCard(state);
    }

    let filtered = [];

    for (let rec of state) {
        if (rec.rarity === filter)
            filtered.push(rec);
    }

    drawCard(filtered);
}

window.drawCard = drawCard;