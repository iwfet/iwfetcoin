import { SHA256 } from "crypto-js";
import { Block } from "../../model/Block";


export const calculateHash = (index: number, previousHash: string, timestamp: number, data: string,difficulty: number, nonce: number): string =>
    SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
    
export const calculateHashForBlock = (block: Block): string =>
    calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);