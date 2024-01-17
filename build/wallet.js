"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.findTxOutsForAmount = exports.createTxOuts = exports.createTransaction = void 0;
const Transaction_1 = require("./model/Transaction");
const TxIn_1 = require("./model/TxIn");
const TxOut_1 = require("./model/TxOut");
const sign_1 = require("./util/transaction/sign");
const transactionId_1 = require("./util/transaction/transactionId");
const lodash_1 = __importDefault(require("lodash"));
const getBalance = (address, unspentTxOuts) => {
    return (0, lodash_1.default)(unspentTxOuts)
        .filter((uTxO) => uTxO.address === address)
        .map((uTxO) => uTxO.amount)
        .sum();
};
exports.getBalance = getBalance;
const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }
    throw Error('not enough coins to send transaction');
};
exports.findTxOutsForAmount = findTxOutsForAmount;
const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
    const txOut1 = new TxOut_1.TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    }
    else {
        const leftOverTx = new TxOut_1.TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};
exports.createTxOuts = createTxOuts;
const createTransaction = (receiverAddress, amount, privateKey, unspentTxOuts) => {
    const myAddress = (0, sign_1.getPublicKey)(privateKey);
    const myUnspentTxOuts = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);
    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(amount, myUnspentTxOuts);
    const toUnsignedTxIn = (unspentTxOut) => {
        const txIn = new TxIn_1.TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };
    const unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);
    const tx = new Transaction_1.Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = (0, transactionId_1.getTransactionId)(tx);
    tx.txIns = tx.txIns.map((txIn, index) => {
        txIn.signature = (0, sign_1.signTxIn)(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });
    return tx;
};
exports.createTransaction = createTransaction;
//# sourceMappingURL=wallet.js.map