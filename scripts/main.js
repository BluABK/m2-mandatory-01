function generateAddItemView() {
    return `
        <h1>Inventory Management</h1>
        <p>
            Add items to your inventory!<br>
            Fields marked with asterisk (*) are required.
        </p>
        <br>
        <div id="add-item-container">
            <label class="add-item-label" for="input-item-name" title="Name">Name</label>
            <input class="add-item-input" type="text" id="input-item-name">
            <br>
            <label class="add-item-label" for="input-item-description" title="Description">Description</label>
            <textarea class="add-item-input" id="input-item-description"></textarea>
        </div>
        <br>
        <button onClick="addItem('${model.inputItemName}','${model.inputItemDesc}')" ${inputIsValid() ? "" : "disabled"}>Add</button>
        <br>
        <button onClick="goToPage(1)">Goto: Inv mgmt</button>
    `;
}

function generateInventoryTable() {
    let tableHeadings = `
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Added On</th>
            <th>Remove?</th>
        </tr>
    `;
    let tableBody = "";

    for (let i = 0; i < model.items.length; i++) {
        tableBody += `
            <tr>
                <td>${model.items[i].name}</td>
                <td>${model.items[i].description}</td>
                <td>${model.items[i].addedOn.toISOString().split('.')[0].replace('T', ' ')}</td>
                <td><span class="table-item-remove" onclick="deleteItem(${i})">X</span></td>
            </tr>
        `
    }

    let table = `
        <table class="inventory-items-table">
            <thead>
                ${tableHeadings}
            </thead>
            <tbody>
                ${tableBody}
            </tbody>
        </table>
    `;



    return table;
}

function generateInventoryListView() {
    return `
        <h1>Inventory</h1>
        <p>
            Click cell to edit. 
        </p>
        <br>
        ${generateInventoryTable()}
        <br>
        <button onClick="goToPage(0)">Goto: Item adder</button>
    `;
}

function updateViews() {
    document.getElementById("app").innerHTML = `
        <div id="content">
            ${model.currentPage === 0 ? generateAddItemView() : generateInventoryListView()}
        </div>
    `;
}

function goToPage(index) {
    model.currentPage = index;
    updateViews();
}

function deleteItem(itemsIndex) {
    console.log("deleteItem", itemsIndex);
    model.items.splice(itemsIndex, 1);

    updateViews();
}

function clearInventory() {
    model.items = [];
}

function validateInput() {

}

function inputIsValid() {
    return model.inputItemName !== "";
}

function addItem(title, description) {
    console.log("addItem", title, description);
}

// Start with a clean slate.
// clearInventory();

updateViews();