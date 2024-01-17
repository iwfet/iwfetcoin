"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTxIn = void 0;
const sign_1 = require("./sign");
const validateTxIn = (txIn, transaction, aUnspentTxOuts) => {
    const referencedUTxOut = aUnspentTxOuts.find((uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutId === txIn.txOutId);
    if (referencedUTxOut == undefined) {
        console.log('referenced txOut not found: ' + JSON.stringify(txIn));
        return false;
    }
    const address = referencedUTxOut.address;
    return (0, sign_1.verify)(address, transaction.id, txIn.signature);
};
exports.validateTxIn = validateTxIn;
//# sourceMappingURL=validate.js.map