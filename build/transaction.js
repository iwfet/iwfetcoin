"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoinbaseTransaction = exports.COINBASE_AMOUNT = exports.processTransactions = void 0;
const Transaction_1 = require("./model/Transaction");
const TxIn_1 = require("./model/TxIn");
const TxOut_1 = require("./model/TxOut");
const isValidTransactionsStructure_1 = require("./util/transaction/isValidTransactionsStructure");
const transactionId_1 = require("./util/transaction/transactionId");
const updateUnspentTxOuts_1 = require("./util/transaction/updateUnspentTxOuts");
const validateBlockTransactions_1 = require("./util/transaction/validateBlockTransactions");
const COINBASE_AMOUNT = 50;
exports.COINBASE_AMOUNT = COINBASE_AMOUNT;
const processTransactions = (aTransactions, aUnspentTxOuts, blockIndex) => {
    if (!(0, isValidTransactionsStructure_1.isValidTransactionsStructure)(aTransactions)) {
        return null;
    }
    if (!(0, validateBlockTransactions_1.validateBlockTransactions)(aTransactions, aUnspentTxOuts, blockIndex)) {
        console.log('invalid block transactions');
        return null;
    }
    return (0, updateUnspentTxOuts_1.updateUnspentTxOuts)(aTransactions, aUnspentTxOuts);
};
exports.processTransactions = processTransactions;
const getCoinbaseTransaction = (address, blockIndex) => {
    const t = new Transaction_1.Transaction();
    const txIn = new TxIn_1.TxIn();
    txIn.signature = "";
    txIn.txOutId = "";
    txIn.txOutIndex = blockIndex;
    t.txIns = [txIn];
    t.txOuts = [new TxOut_1.TxOut(address, COINBASE_AMOUNT)];
    t.id = (0, transactionId_1.getTransactionId)(t);
    return t;
};
exports.getCoinbaseTransaction = getCoinbaseTransaction;
//# sourceMappingURL=transaction.js.map