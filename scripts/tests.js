function updateViews() {} // Dummy function.

/**
 * Perform various actions to clean up the model,
 * in order to ensure tests are run in a clean environment.
 */
function cleanupModel() {
    // Reset model items array.
    model.items = [];

    if (model.items.length !== 0) {
        return `Test environment is *NOT* clean! Reason: model.items.length (${model.items.length}) !== 0`;
    }

    return true;
}

QUnit.test("Add item.", function (assert) {
    const itemName = "My Test Item";
    const itemDesc = `Unit Test: "Valid input: Add item"`;

    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Add the item.
    assert.true(addItem(itemName, itemDesc), "Add the item.");

    // Verify that item was added.
    assert.true(model.items.some(item => item.name === itemName), "Verify that item was added.");
});

QUnit.test("Edit item.", function (assert) {
    const itemName = "My Test Item";
    const itemDesc = `Unit Test: "Valid input: Add item"`;

    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Add the item.
    assert.true(addItem(itemName, itemDesc), "Add the item.");

    // Verify that item was added.
    assert.true(model.items.some(item => item.name === itemName), "Verify that item was added.");

    // Edit item name.
    let newItemName = "My (Renamed) Test Item";
    editItem(0, newItemName);
    assert.equal(model.items[0].name, newItemName, "Rename Test item name.")

    // Edit item description.
    let newItemDesc = `Unit Test: "Valid input: Add item (renamed)"`;
    editItem(0, null, newItemDesc);
    assert.equal(model.items[0].description, newItemDesc, "Rename Test item description.")
});

QUnit.test("Delete item.", function (assert) {
    const itemName = "My Test Item";
    const itemDesc = `Unit Test: "Valid input: Add item"`;

    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Add the item.
    assert.true(addItem(itemName, itemDesc), "Add the item.");

    // Verify that item was added.
    assert.true(model.items.some(item => item.name === itemName), "Verify that item was added.");

    // Delete item.
    deleteItem(0);
    assert.equal(model.items.length, 0, "Delete Test item.")
});

QUnit.test("Manage item (entire workflow).", function (assert) {
    const itemName = "My Test Item";
    const itemDesc = `Unit Test: "Valid input: Add item"`;

    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Add the item.
    assert.true(addItem(itemName, itemDesc), "Add the item.");

    // Verify that item was added.
    assert.true(model.items.some(item => item.name === itemName), "Verify that item was added.");

    // Edit item name.
    let newItemName = "My (Renamed) Test Item";
    editItem(0, newItemName);
    assert.equal(model.items[0].name, newItemName, "Rename Test item name.")

    // Edit item description.
    let newItemDesc = `Unit Test: "Valid input: Add item (renamed)"`;
    editItem(0, null, newItemDesc);
    assert.equal(model.items[0].description, newItemDesc, "Rename Test item description.")

    // Delete item.
    deleteItem(0);
    assert.equal(model.items.length, 0, "Delete Test item.")
});

QUnit.test("Unable to add item when given invalid input.", function (assert) {
    // Define the item.
    const itemName = "@$%~";
    const itemDesc = `Unit Test: "Invalid input: Add item"`;

    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Add the item.
    assert.true(addItem(itemName, itemDesc), "Add the item.");

    // Verify that item was added.
    assert.false(model.items.some(item => item.name === itemName), "Verify that item was *NOT* added.");
});

QUnit.test("Unable to edit item when given invalid input.", function (assert) {
    const itemName = "My Test Item";
    const itemDesc = `Unit Test: "Valid input: Add item"`;

    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Add the item.
    assert.true(addItem(itemName, itemDesc), "Add the item.");

    // Perform edits.
    assert.false(editItem("Not an index"), "Unable to edit item index that is NaN.");
    assert.false(editItem(model.items.length, "rename"), "Unable to edit item index that is OOB.");
    assert.false(editItem(0), "Treat lack of both newName and newDescription params as a failed op.");

});

QUnit.test("Unable to delete item when given invalid input.", function (assert) {
    // Ensure test environment is clean.
    assert.true(cleanupModel(), "Clean test environment.");

    // Perform deletion.
    assert.false(deleteItem("Not an index"), "Unable to delete item index that is NaN.");
    assert.false(deleteItem(model.items.length), "Unable to delete item index that is OOB.");
    assert.false(deleteItem(0), "Unable to delete item that never existed.");
});