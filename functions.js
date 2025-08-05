function validateName(Name) {
    return /^[a-zA-Z\s]+$/.test(Name);
}

function validateDeposit(deposit) {
    return (deposit && !isNaN(deposit) && deposit >= 1000 && deposit <= 1000000);
}

function validatePin(Pin) {
    return /^\d{4}$/.test(Pin);
}
