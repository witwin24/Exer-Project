const itemName = document.getElementById('item_name');
const itemPrice = document.getElementById('item_price');
const item_list = document.getElementById("item_list");

let itemList = []
window.onload = function(){
        item_list.innerHTML += `<tr><td colspan="3" style="text-align:center;">Not Found Item !!</td></tr>`;
}

function addItem() {

   const name = itemName.value.trim();
    const price = itemPrice.value.trim();

    const isOnlySpecialChars = /^[^a-zA-Zก-๙]+$/.test(name);
    const isOnlyNumbers = /^[0-9]+$/.test(name);

    if (!name || isOnlySpecialChars || !price || price < 0 || isOnlyNumbers) {
        alert('Please enter a valid item name (not only special characters) and a price that is 0 or higher.');
        return;
    }

    const item = {
        id: Date.now(),
        name: name,
        price: price
    }
    itemList.push(item);

    document.getElementById('item_name').value = '';
    document.getElementById('item_price').value = '';

    updateRow();
}

function updateRow() {
     if (itemList.length === 0) {
        item_list.innerHTML = '';
        item_list.innerHTML += `<tr><td colspan="3" style="text-align:center;">Not Found Item !!</td></tr>`;
        return;
    }
    
    if (itemList.length >= 1) {
        item_list.innerHTML = '';
        item_list.innerHTML = `<tr> <th>Item</th> <th>Price</th> <th>Action</th> </tr>`;
    }
    for (let i = 0; i < itemList.length; i++) {
        item_list.innerHTML += `<tr>
            <td>${itemList[i].name}</td>
            <td>$${itemList[i].price}</td>
            <td><button class="delete-btn" onclick="deleteItem(${itemList[i].id})">Delete</button></td></tr>`;

    }

}


function deleteItem(id) {

    itemList = itemList.filter(item => (item.id != id));

    updateRow();
}