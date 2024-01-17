"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnspentTxOuts = void 0;
const UnspentTxOut_1 = require("../../model/UnspentTxOut");
const validateBlockTransactions_1 = require("./validateBlockTransactions");
const updateUnspentTxOuts = (newTransactions, aUnspentTxOuts) => {
    const newUnspentTxOuts = newTransactions
        .map((t) => {
        return t.txOuts.map((txOut, index) => new UnspentTxOut_1.UnspentTxOut(t.id, index, txOut.address, txOut.amount));
    })
        .reduce((a, b) => a.concat(b), []);
    const consumedTxOuts = newTransactions
        .map((t) => t.txIns)
        .reduce((a, b) => a.concat(b), [])
        .map((txIn) => new UnspentTxOut_1.UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));
    const resultingUnspentTxOuts = aUnspentTxOuts
        .filter(((uTxO) => !(0, validateBlockTransactions_1.findUnspentTxOut)(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts)))
        .concat(newUnspentTxOuts);
    return resultingUnspentTxOuts;
};
exports.updateUnspentTxOuts = updateUnspentTxOuts;
//# sourceMappingURL=updateUnspentTxOuts.js.map