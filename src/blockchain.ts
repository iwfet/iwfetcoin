
import { Block } from './model/Block';
import { Transaction } from './model/Transaction';
import { UnspentTxOut } from './model/UnspentTxOut';
import {broadcastLatest} from './p2p';
import { getCoinbaseTransaction, processTransactions } from './transaction';
import { getAccumulatedDifficulty, getDifficulty, hashMatchesDifficulty } from './util/blockchain/difficulty';
import { calculateHash} from './util/blockchain/hash';
import { isValidChain, isValidNewBlock } from './util/blockchain/valid';
import { getCurrentTimestamp } from './util/timesTamp';
import { isValidAddress } from './util/transaction/isValidTransactionsStructure';
import { getPrivateFromWallet, getPublicFromWallet } from './util/wallet/sing';
import { createTransaction, getBalance } from './wallet';

const genesisBlock: Block = new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', "", 1465154705,[],0,0 );
const blockchain: Block[] = [genesisBlock];
let unspentTxOuts: UnspentTxOut[] = [];
const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];




const generateRawNextBlock = (blockData: Transaction[]) => {
    const previousBlock: Block = getLatestBlock();
    const difficulty: number = getDifficulty(getBlockchain());
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getCurrentTimestamp();
    const newBlock: Block = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if (addBlockToChain(newBlock)) {
        broadcastLatest();
        return newBlock;
    } else {
        return null;
    }

};



const generateNextBlock = () => {
    const coinbaseTx: Transaction = getCoinbaseTransaction(getPublicFromWallet(), getLatestBlock().index + 1);
    const blockData: Transaction[] = [coinbaseTx];
    return generateRawNextBlock(blockData);
};


const findBlock = (index: number, previousHash: string, timestamp: number, data: Transaction[], difficulty: number): Block => {
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

const addBlockToChain = (newBlock: Block): boolean => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        const retVal: UnspentTxOut[] | null = processTransactions(newBlock.data, unspentTxOuts, newBlock.index);
        if (retVal === null) {
            return false;
        } else {
            blockchain.push(newBlock);
            unspentTxOuts = retVal;
            return true;

        }
    }
    return false;
};


const getAccountBalance = (): number => {
    return getBalance(getPublicFromWallet(), unspentTxOuts);
};


const generatenextBlockWithTransaction = (receiverAddress: string, amount: number) => {
    if (!isValidAddress(receiverAddress)) {
        throw Error('invalid address');
    }
    if (typeof amount !== 'number') {
        throw Error('invalid amount');
    }
    const coinbaseTx: Transaction = getCoinbaseTransaction(getPublicFromWallet(), getLatestBlock().index + 1);
    const tx: Transaction = createTransaction(receiverAddress, amount, getPrivateFromWallet(), unspentTxOuts);
    const blockData: Transaction[] = [coinbaseTx, tx];
    return generateRawNextBlock(blockData);
};



export { getBlockchain, getLatestBlock, generateNextBlock, replaceChain, addBlockToChain,genesisBlock,generateRawNextBlock,getAccountBalance,generatenextBlockWithTransaction};