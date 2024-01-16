"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genesisBlock = exports.addBlockToChain = exports.replaceChain = exports.generateNextBlock = exports.getLatestBlock = exports.getBlockchain = void 0;
const Block_1 = require("./model/Block");
const p2p_1 = require("./p2p");
const difficulty_1 = require("./util/blockchain/difficulty");
const hash_1 = require("./util/blockchain/hash");
const valid_1 = require("./util/blockchain/valid");
const timesTamp_1 = require("./util/timesTamp");
const genesisBlock = new Block_1.Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', "", 1465154705, 'my genesis block!!', 0, 0);
exports.genesisBlock = genesisBlock;
const blockchain = [genesisBlock];
const getBlockchain = () => blockchain;
exports.getBlockchain = getBlockchain;
const getLatestBlock = () => blockchain[blockchain.length - 1];
exports.getLatestBlock = getLatestBlock;
const addBlock = (newBlock) => {
    if ((0, valid_1.isValidNewBlock)(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};
const generateNextBlock = (blockData) => {
    const previousBlock = getLatestBlock();
    const difficulty = (0, difficulty_1.getDifficulty)(getBlockchain());
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = (0, timesTamp_1.getCurrentTimestamp)();
    const newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    console.log(newBlock);
    addBlock(newBlock);
    (0, p2p_1.broadcastLatest)();
    return newBlock;
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
        blockchain.push(newBlock);
        return true;
    }
    return false;
};
exports.addBlockToChain = addBlockToChain;
//# sourceMappingURL=blockchain.js.map