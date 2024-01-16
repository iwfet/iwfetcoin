
import { Block } from './model/Block';
import {broadcastLatest} from './p2p';
import { getAccumulatedDifficulty, getDifficulty, hashMatchesDifficulty } from './util/blockchain/difficulty';
import { calculateHash} from './util/blockchain/hash';
import { isValidChain, isValidNewBlock } from './util/blockchain/valid';
import { getCurrentTimestamp } from './util/timesTamp';

const genesisBlock: Block = new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', "", 1465154705, 'my genesis block!!',0,0 );
const blockchain: Block[] = [genesisBlock];
const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];


const addBlock = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};


const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const difficulty = getDifficulty(getBlockchain())
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getCurrentTimestamp()
    const newBlock: Block = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);  
    addBlock(newBlock);
    broadcastLatest();
    return newBlock;
};


const findBlock = (index: number, previousHash: string, timestamp: number, data: string, difficulty: number): Block => {
    let nonce = 0;
    while (true) {
        const hash: string = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};



const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) &&  getAccumulatedDifficulty(newBlocks) > getAccumulatedDifficulty(getBlockchain())) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain.length = 0;
        newBlocks.forEach(element => blockchain.push(element));     
        broadcastLatest();
    } else {
        console.log('Received blockchain invalid');
    }
};

const addBlockToChain = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};



export { getBlockchain, getLatestBlock, generateNextBlock, replaceChain, addBlockToChain,genesisBlock};