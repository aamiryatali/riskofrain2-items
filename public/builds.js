function showLoginDialog() {
    var dialog = document.getElementById('login-dialog');
    dialog.style.display = 'block';
}

let state = [];

function drawCard(records){
    let result = document.querySelector('');

    let html = '';

    for(let rec of records){
        html += ``;
    }
    result.innerHTML = html;
}

async function getData() {
    const response = await fetch('https://riskofrain2api.herokuapp.com/api/everyItem');
    const data = await response.json();
    return data;
}

async function showItems() {
    state = await getData();
    drawCard(state);
}

showItems();

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
    let result = document.querySelector('');

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

