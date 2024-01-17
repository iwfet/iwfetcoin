"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatenextBlockWithTransaction = exports.getAccountBalance = exports.generateRawNextBlock = exports.genesisBlock = exports.addBlockToChain = exports.replaceChain = exports.generateNextBlock = exports.getLatestBlock = exports.getBlockchain = void 0;
const Block_1 = require("./model/Block");
const p2p_1 = require("./p2p");
const transaction_1 = require("./transaction");
const difficulty_1 = require("./util/blockchain/difficulty");
const hash_1 = require("./util/blockchain/hash");
const valid_1 = require("./util/blockchain/valid");
const timesTamp_1 = require("./util/timesTamp");
const isValidTransactionsStructure_1 = require("./util/transaction/isValidTransactionsStructure");
const sing_1 = require("./util/wallet/sing");
const wallet_1 = require("./wallet");
const genesisBlock = new Block_1.Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', "", 1465154705, [], 0, 0);
exports.genesisBlock = genesisBlock;
const blockchain = [genesisBlock];
let unspentTxOuts = [];
const getBlockchain = () => blockchain;
exports.getBlockchain = getBlockchain;
const getLatestBlock = () => blockchain[blockchain.length - 1];
exports.getLatestBlock = getLatestBlock;
const generateRawNextBlock = (blockData) => {
    const previousBlock = getLatestBlock();
    const difficulty = (0, difficulty_1.getDifficulty)(getBlockchain());
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = (0, timesTamp_1.getCurrentTimestamp)();
    const newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if (addBlockToChain(newBlock)) {
        (0, p2p_1.broadcastLatest)();
        return newBlock;
    }
    else {
        return null;
    }
};
exports.generateRawNextBlock = generateRawNextBlock;
const generateNextBlock = () => {
    const coinbaseTx = (0, transaction_1.getCoinbaseTransaction)((0, sing_1.getPublicFromWallet)(), getLatestBlock().index + 1);
    const blockData = [coinbaseTx];
    return generateRawNextBlock(blockData);
};
exports.generateNextBlock = generateNextBlock;
const findBlock = (index, previousHash, timestamp, data, difficulty) => {
    let nonce = 0;
    while (true) {
        const hash = (0, hash_1.calculateHash)(index, previousHash, timestamp, data, difficulty, nonce);
        if ((0, difficulty_1.hashMatchesDifficulty)(hash, difficulty)) {
            return new Block_1.Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};
const replaceChain = (newBlocks) => {
    if ((0, valid_1.isValidChain)(newBlocks) && (0, difficulty_1.getAccumulatedDifficulty)(newBlocks) > (0, difficulty_1.getAccumulatedDifficulty)(getBlockchain())) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain.length = 0;
        newBlocks.forEach(element => blockchain.push(element));
        (0, p2p_1.broadcastLatest)();
    }
    else {
        console.log('Received blockchain invalid');
    }
};
exports.replaceChain = replaceChain;
const addBlockToChain = (newBlock) => {
    if ((0, valid_1.isValidNewBlock)(newBlock, getLatestBlock())) {
        const retVal = (0, transaction_1.processTransactions)(newBlock.data, unspentTxOuts, newBlock.index);
        if (retVal === null) {
            return false;
        }
        else {
            blockchain.push(newBlock);
            unspentTxOuts = retVal;
            return true;
        }
    }
    return false;
};
exports.addBlockToChain = addBlockToChain;
const getAccountBalance = () => {
    return (0, wallet_1.getBalance)((0, sing_1.getPublicFromWallet)(), unspentTxOuts);
};
exports.getAccountBalance = getAccountBalance;
const generatenextBlockWithTransaction = (receiverAddress, amount) => {
    if (!(0, isValidTransactionsStructure_1.isValidAddress)(receiverAddress)) {
        throw Error('invalid address');
    }
    if (typeof amount !== 'number') {
        throw Error('invalid amount');
    }
    const coinbaseTx = (0, transaction_1.getCoinbaseTransaction)((0, sing_1.getPublicFromWallet)(), getLatestBlock().index + 1);
    const tx = (0, wallet_1.createTransaction)(receiverAddress, amount, (0, sing_1.getPrivateFromWallet)(), unspentTxOuts);
    const blockData = [coinbaseTx, tx];
    return generateRawNextBlock(blockData);
};
exports.generatenextBlockWithTransaction = generatenextBlockWithTransaction;
//# sourceMappingURL=blockchain.js.map