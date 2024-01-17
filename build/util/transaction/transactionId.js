"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionId = void 0;
const crypto_js_1 = require("crypto-js");
const getTransactionId = (transaction) => {
    const txInContent = transaction.txIns
        .map((txIn) => txIn.txOutId + txIn.txOutIndex)
        .reduce((a, b) => a + b, '');
    const txOutContent = transaction.txOuts
        .map((txOut) => txOut.address + txOut.amount)
        .reduce((a, b) => a + b, '');
    return (0, crypto_js_1.SHA256)(txInContent + txOutContent).toString();
};
exports.getTransactionId = getTransactionId;
//# sourceMappingURL=transactionId.js.map