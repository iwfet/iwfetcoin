"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHashForBlock = exports.calculateHash = void 0;
const crypto_js_1 = require("crypto-js");
const calculateHash = (index, previousHash, timestamp, data, difficulty, nonce) => (0, crypto_js_1.SHA256)(index + previousHash + timestamp + data + difficulty + nonce).toString();
exports.calculateHash = calculateHash;
const calculateHashForBlock = (block) => (0, exports.calculateHash)(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);
exports.calculateHashForBlock = calculateHashForBlock;
//# sourceMappingURL=hash.js.map