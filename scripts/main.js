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
            <input class="add-item-input" type="text" id="input-item-name" value="${model.inputs.inputItemName}"
                   onInput="validateInputNameAndUpdateViews(this)">
            <br><br>
            <label class="add-item-label" for="input-item-description" title="Description">Description</label>
            <textarea class="add-item-input" id="input-item-description" onInput="updateDescriptionAndUpdateViews(this)">${model.inputs.inputItemDesc}</textarea>
        </div>
        <br><br><br>
        <button onClick="addItemAndUpdateViews('${model.inputs.inputItemName}','${model.inputs.inputItemDesc}')" ${inputNameIsValid() ? "" : "disabled"}>Add</button>
        <br><br>
        <button onClick="goToPage(1)">Goto: Inv mgmt</button>
    `;
}

function generateInventoryTable() {
    let tableHeadings = `
        <tr>
            <th class="uneditable">Name</th>
            <th class="uneditable">Description</th>
            <th class="uneditable">Added On</th>
            <th class="uneditable">Remove?</th>
        </tr>
    `;
    let tableBody = "";

    for (let i = 0; i < model.items.length; i++) {
        tableBody += `
            <tr>
                <td contenteditable onFocusOut="editItemAndUpdateViews(${i}, this.innerText, ${null})">${model.items[i].name}</td>
                <td contenteditable onFocusOut="editItemAndUpdateViews(${i}, ${null}, this.innerText)">${model.items[i].description}</td>
                <td class="uneditable">${model.items[i].addedOn.toISOString().split('.')[0].replace('T', ' ')}</td>
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
            Click cell to edit (saves on de-focus).
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

    // Custom View handling for page 0 (Item adder page) .
    if (model.currentPage === 0) {
        // Fix focus loss when redrawing page.
        if (model.inputs.lastFocusedElementId !== null) document.getElementById(model.inputs.lastFocusedElementId).focus();

        // Put caret at the last position instead of start of text.
        if (model.inputs.lastCaretPosition !== null) document.getElementById(model.inputs.lastFocusedElementId).selectionStart = parseInt(model.inputs.lastCaretPosition);
    }
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
    // Check that itemsIndex is an integer.
    if (!Number.isInteger(itemsIndex)) {
        console.error("itemsIndex is *NOT* an integer value!", itemsIndex);
        return false;
    }

    // Verify that item index is within bounds.
    if (model.items.length <= itemsIndex) {
        console.error("Attempted to delete item in OOB index!", itemsIndex, model.items.length);
        return false;
    }

    model.items.splice(itemsIndex, 1);

    updateViews(); // FIXME: onClick listen to new func that calls this then updates?

    return true;
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
    // Check that either name or description param were given.
    if (!newName && !newDescription) {
        console.error("Can't edit item if neither name nor description is given as parameter!");
        return false;
    }

    // Check that itemsIndex is an integer.
    if (!Number.isInteger(itemsIndex)) {
        console.error("itemsIndex is *NOT* an integer value!", itemsIndex);
        return false;
    }

    // Verify that item exists.
    if (model.items.length <= itemsIndex) {
        console.error("Attempted to edit item in OOB index!", itemsIndex, model.items.length);
        return false;
    }

    // Edit properties if given parameters.
    if (existsAndIsOfType(newName, "string"))
    {
        if (inputNameIsValid(newName) === true) {
            model.items[itemsIndex].name = newName;
        } else {
            let validatedName = validateInputName(newName);

            // If validated name is shorter than original name,
            // then we know the invalid char occurred at last index +1, i.e. '.length'.
            if (validatedName.length < newName.length) {
                alert(`Invalid input char "${newName.charAt(validatedName.length)}" at position ${validatedName.length}!`);
            } else {
                alert("Invalid input!");
            }
        }
    }

    if (existsAndIsOfType(newDescription, "string")) model.items[itemsIndex].description = newDescription;

    return true;
}

/**
 * Edits an item and updates Views.
 * @param {any} args List of arguments to pass on.
 */
function editItemAndUpdateViews(...args) {
    editItem(...args);
    updateViews();
}

function clearInventory() {
    model.items = [];
}

function clearInputs() {
    model.inputs.inputItemName = model.inputs.inputItemDesc = "";
}

/**
 * Validate input name.
 *
 * Concatenates valid characters, returns current validated string if an invalid character is met.
 * @param name
 * @param caseSensitive
 * @returns {string}
 */
function validateInputName(name, caseSensitive = false) {
    let validName = "";

    for (let i = 0; i < name.length; i++) {
        // Check if char is not in the valid name alphabet.
        if (!model.validNameAlphabet.includes(caseSensitive ? name.charAt(i) : name.charAt(i).toLowerCase())) {
            console.error("validateInputName encountered invalid input char, returning validation up until this point!", name.charAt(i));

            return validName;
        }

        // If char is valid, append to valid name string.
        validName += name.charAt(i);
    }

    return validName;
}

/**
 * Helper function to keep input elements in focus after view redraw.
 * @param {String} elementID ID of the element.
 * @param {Number || null} caretPosition Position of the caret in the element (use null if N/A).
 */
function updateLastFocusedElement(elementID, caretPosition) {
    console.log("updateLastFocusedElement", elementID, caretPosition)
    // Set element as last focused element (helper to avoid annoying focus loss on page redraw).
    model.inputs.lastFocusedElementId = elementID;

    // Set caret last position.
    model.inputs.lastCaretPosition = caretPosition;
}

function validateInputNameAndUpdateViews(textInputElement) {
    updateLastFocusedElement(textInputElement.id, "selectionStart" in textInputElement ? textInputElement.selectionStart : null);

    model.inputs.inputItemName = validateInputName(textInputElement.value);

    updateViews();
}

function updateDescriptionAndUpdateViews(textAreaElement) {
    updateLastFocusedElement(textAreaElement.id, "selectionStart" in textAreaElement ? textAreaElement.selectionStart : null);

    model.inputs.inputItemDesc = textAreaElement.value;

    updateViews();
}

/**
 * Check that input name is valid.
 *
 * Checks that it's defined, not empty and validator returns equivalent string.
 * @param {String} name Name validate (default: model.inputs.inputItemName).
 * @returns {boolean}
 */
function inputNameIsValid(name = model.inputs.inputItemName) {
    return name && name !== "" && name === validateInputName(name);
}

function addItem(name, description) {
    if (!inputNameIsValid()) {
        let validatedName = validateInputName(name);

        // If validated name is shorter than original name,
        // then we know the invalid char occurred at last index +1, i.e. '.length'.
        if (validatedName.length < name.length) {
            console.error(`addItem got invalid char "${name.charAt(validatedName.length)}" at position ${validatedName.length}`);
            return false;
        } else {
            console.error(`addItem got invalid input!`, name, validatedName);
        }
    }

    try {
        // Add item.
        model.items.push({name: name, description: description, addedOn: new Date()});

        // Clear input after successful adding of item.
        clearInputs();

        return true;
    } catch (e) {
        console.error("Unexpected exception in addItem", e);
    }

    return false;
}

function addItemAndUpdateViews(name, description) {
    addItem(name, description);

    updateViews();
}

// Start with a clean slate.
// clearInventory();

updateViews();