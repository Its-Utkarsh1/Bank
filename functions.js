function validateName(Name) {
    return /^[a-zA-Z\s]+$/.test(Name);
}

function validateAmt(amt) {
    return (amt && !isNaN(amt) && amt >= 1000 && amt <= 1000000);
}

function validatePin(Pin) {
    return /^\d{4}$/.test(Pin);
}
