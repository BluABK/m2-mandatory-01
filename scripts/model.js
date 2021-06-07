const model = {
    inputs: {
        inputItemName: "",
        inputItemDesc: "",
        lastFocusedElementId : null,
        lastCaretPosition: null,
    },
    lastInvalidInput: null,
    currentPage: 0,
    validNameAlphabet: "abcdefghijklmnopqrstuvwxyzæøå",
    items: [
        {
            name: "Banana",
            description: "Elongated, edible fruit – botanically a berry.",
            addedOn: new Date()
        }
    ]
}