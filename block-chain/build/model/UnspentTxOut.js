"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnspentTxOut = void 0;
class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}
exports.UnspentTxOut = UnspentTxOut;
//# sourceMappingURL=UnspentTxOut.js.map