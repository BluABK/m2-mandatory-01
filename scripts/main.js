function generateAddItemView() {
    return `
        Add Items View
        <br/>
        <button onClick="goToPage(1)">Goto: Inv mgmt</button>
    `;
}

function generateInventoryListView() {
    return `
        Add Inventory List View
        <br/>
        <button onClick="goToPage(0)">Goto: Item adder</button>
        `;
}

function updateViews() {
    document.getElementById("app").innerHTML = `
        ${model.currentPage === 0 ? generateAddItemView() : generateInventoryListView()}
    `;
}

function goToPage(index) {
    model.currentPage = index;
    updateViews();
}

function clearInventory() {
    model.items = [];
}

// Start with a clean slate.
clearInventory();

updateViews();: