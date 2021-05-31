function generateAddItemView() {
    return `
        <h1>Inventory Management</h1>
        <br>
        <p>Add items to your inventory!</p><br>
        <i>Fields marked with asterisk (*) are required.</i><br>
        <br>
        <div id="add-item-container">
            <i>Name can only contain characters between ${model.validNameAlphabet.charAt(0)}-${model.validNameAlphabet.charAt(model.validNameAlphabet.length-1).toUpperCase()}.</i>
            <br><br>
            <label class="add-item-label" for="input-item-name" title="Name">Name *</label>
            <input class="add-item-input" type="text" id="input-item-name" onInput="validateInput()">
            <br><br>
            <label class="add-item-label" for="input-item-description" title="Description">Description</label>
            <textarea class="add-item-input" id="input-item-description"></textarea>
        </div>
        <br><br><br>
        <button onClick="addItem('${model.inputItemName}','${model.inputItemDesc}')" ${inputIsValid() ? "" : "disabled"}>Add</button>
        <br><br>
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
        <br>
        <p>
            Click cell to edit. 
        </p>
        <br><br>
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

function existsAndIsOfType(x, type) {
    if (x) {
        if (typeof x === type) return true;
    }

    return false;
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

/**
 * Edit item in model's items Array.
 *
 * If neither newName nor newDescription parameters are supplied, it is treated as a failure.
 * @param {Number} itemsIndex Item's position in model's items Array.
 * @param {String} newName Change item's name to this.
 * @param {String} newDescription Change item's description to this.
 * @returns {boolean} Whether successful.
 */
function editItem(itemsIndex, newName = null , newDescription = null) {
    console.log("editItem", itemsIndex, newName, newDescription);

    // Check that either name or description param were given.
    if (!newName && !newDescription) {
        console.error("Can't edit item if neither name nor description is given as parameter!");
        return false;
    }

    // Verify that item exists.
    if (model.items.length <= itemsIndex) {
        console.error("Attempted to edit item in OOB index!", itemsIndex, model.items.length);
        return false;
    }

    // Edit properties if given parameters.
    if (existsAndIsOfType(newName, "string")) model.items[itemsIndex].name = newName;
    if (existsAndIsOfType(newDescription, "string")) model.items[itemsIndex].description = newDescription;

    return true;
}

function clearInventory() {
    model.items = [];
}

function validateInput() {

}

function inputIsValid() {
    return model.inputItemName !== "";
}

function addItem(name, description) {
    console.log("addItem", name, description);
    try {
        model.items.push({name: name, description: description, addedOn: new Date()});

        return true;
    } catch (e) {
        console.error("Unexpected exception in addItem", e);
    }

    return false;
}

// Start with a clean slate.
// clearInventory();

updateViews();