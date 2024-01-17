"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccumulatedDifficulty = exports.hashMatchesDifficulty = exports.getAdjustedDifficulty = exports.getDifficulty = void 0;
const blockchain_1 = require("../../blockchain");
const hexToBinary_1 = require("./hexToBinary");
const BLOCK_GENERATION_INTERVAL = 10;
// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
const getDifficulty = (aBlockchain) => {
    const latestBlock = aBlockchain[(0, blockchain_1.getBlockchain)().length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    }
    else {
        return latestBlock.difficulty;
    }
};
exports.getDifficulty = getDifficulty;
const getAdjustedDifficulty = (latestBlock, aBlockchain) => {
    const prevAdjustmentBlock = aBlockchain[(0, blockchain_1.getBlockchain)().length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficulty + 1;
    }
    else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.difficulty - 1;
    }
    else {
        return prevAdjustmentBlock.difficulty;
    }
};
exports.getAdjustedDifficulty = getAdjustedDifficulty;
const hashMatchesDifficulty = (hash, difficulty) => {
    const hashInBinary = (0, hexToBinary_1.hexToBinary)(hash);
    if (hashInBinary === null)
        return false;
    const requiredPrefix = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
};
exports.hashMatchesDifficulty = hashMatchesDifficulty;
const getAccumulatedDifficulty = (aBlockchain) => {
    return aBlockchain
        .map((block) => block.difficulty)
        .map((difficulty) => Math.pow(2, difficulty))
        .reduce((a, b) => a + b);
};
exports.getAccumulatedDifficulty = getAccumulatedDifficulty;
//# sourceMappingURL=difficulty.js.map