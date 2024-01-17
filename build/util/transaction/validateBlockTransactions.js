"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUnspentTxOut = exports.validateBlockTransactions = void 0;
const transaction_1 = require("../../transaction");
const transactionId_1 = require("./transactionId");
const lodash_1 = __importDefault(require("lodash"));
const validate_1 = require("./validate");
const validateBlockTransactions = (aTransactions, aUnspentTxOuts, blockIndex) => {
    const coinbaseTx = aTransactions[0];
    if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
        console.log('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
        return false;
    }
    //check for duplicate txIns. Each txIn can be included only once
    const txIns = (0, lodash_1.default)(aTransactions)
        .map(tx => tx.txIns)
        .flatten()
        .value();
    if (hasDuplicates(txIns)) {
        return false;
    }
    // all but coinbase transactions
    const normalTransactions = aTransactions.slice(1);
    return normalTransactions.map((tx) => validateTransaction(tx, aUnspentTxOuts))
        .reduce((a, b) => (a && b), true);
};
exports.validateBlockTransactions = validateBlockTransactions;
const validateCoinbaseTx = (transaction, blockIndex) => {
    if (transaction == null) {
        console.log('the first transaction in the block must be coinbase transaction');
        return false;
    }
    if ((0, transactionId_1.getTransactionId)(transaction) !== transaction.id) {
        console.log('invalid coinbase tx id: ' + transaction.id);
        return false;
    }
    if (transaction.txIns.length !== 1) {
        console.log('one txIn must be specified in the coinbase transaction');
        return false;
    }
    if (transaction.txIns[0].txOutIndex !== blockIndex) {
        console.log('the txIn signature in coinbase tx must be the block height');
        return false;
    }
    if (transaction.txOuts.length !== 1) {
        console.log('invalid number of txOuts in coinbase transaction');
        return false;
    }
    if (transaction.txOuts[0].amount != transaction_1.COINBASE_AMOUNT) {
        console.log('invalid coinbase amount in coinbase transaction');
        return false;
    }
    return true;
};
const hasDuplicates = (txIns) => {
    const groups = lodash_1.default.countBy(txIns, (txIn) => txIn.txOutId + txIn.txOutId);
    return (0, lodash_1.default)(groups)
        .map((value, key) => {
        if (value > 1) {
            console.log('duplicate txIn: ' + key);
            return true;
        }
        else {
            return false;
        }
    })
        .includes(true);
};
const validateTransaction = (transaction, aUnspentTxOuts) => {
    if ((0, transactionId_1.getTransactionId)(transaction) !== transaction.id) {
        console.log('invalid tx id: ' + transaction.id);
        return false;
    }
    const hasValidTxIns = transaction.txIns
        .map((txIn) => (0, validate_1.validateTxIn)(txIn, transaction, aUnspentTxOuts))
        .reduce((a, b) => a && b, true);
    if (!hasValidTxIns) {
        console.log('some of the txIns are invalid in tx: ' + transaction.id);
        return false;
    }
    const totalTxInValues = transaction.txIns
        .map((txIn) => getTxInAmount(txIn, aUnspentTxOuts))
        .reduce((a, b) => (a + b), 0);
    const totalTxOutValues = transaction.txOuts
        .map((txOut) => txOut.amount)
        .reduce((a, b) => (a + b), 0);
    if (totalTxOutValues !== totalTxInValues) {
        console.log('totalTxOutValues !== totalTxInValues in tx: ' + transaction.id);
        return false;
    }
    return true;
};
const getTxInAmount = (txIn, aUnspentTxOuts) => {
    var _a;
    return (_a = findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts)) === null || _a === void 0 ? void 0 : _a.amount;
};
const findUnspentTxOut = (transactionId, index, aUnspentTxOuts) => {
    return aUnspentTxOuts.find((uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index);
};
exports.findUnspentTxOut = findUnspentTxOut;
//# sourceMappingURL=validateBlockTransactions.js.map