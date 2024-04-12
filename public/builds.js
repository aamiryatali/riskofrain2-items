function showLoginDialog() {
    var dialog = document.getElementById('login-dialog');
    dialog.style.display = 'block';
}

let state = [];

function drawItems(records){
    let result = document.querySelector('#item-section');

    let html = '';

    for(let rec of records){
        if(rec.rarity === 'Common'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
      for(let rec of records){
        if(rec.rarity === 'Uncommon'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid #00c853;" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
      for(let rec of records){
        if(rec.rarity === 'Legendary'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
      for(let rec of records){
        if(rec.rarity === 'Boss'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
      for(let rec of records){
        if(rec.rarity === 'Lunar'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid #80d8ff;" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
      for(let rec of records){
        if(rec.rarity === 'Void'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid #d500f9;" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
      for(let rec of records){
        if(rec.rarity === 'Equipment'){
          html += `<img src="${rec.itemImage}" style="border: 2px solid ${rec.color};" onclick="itemDesc('${rec._id}')"><p>${rec.itemName}</p>`;
        }
      }
    result.innerHTML = html;
}

async function getData() {
    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    state = await response.json();
}

function filterBy(filter){
    if(filter === 'All'){
        return drawCard();
    }

    let filtered = [];

    for (let rec of state) {
        if (rec.rarity === filter)
            filtered.push(rec);
    }

    draw(filtered);
}

function itemDesc(item){
    let result = document.querySelector('#item-section');

    let html = '';

    for(let rec of state){
        if(rec.itemImage === item){
            html += `<div id="full-page-element">
<img src="${rec.itemImage}" alt="${rec.itemName}">
<p>Item Description:</p>
<p>${rec.description}</p>
<p>Stack Type:</p>
<p>${rec.stackType}</p>
</div>`;
        }
    }
    result.innerHTML = html;
}

window.itemDesc = itemDesc;
