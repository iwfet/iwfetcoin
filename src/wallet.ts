import { Transaction } from "./model/Transaction";
import { TxIn } from "./model/TxIn";
import { TxOut } from "./model/TxOut";
import { UnspentTxOut } from "./model/UnspentTxOut";
import { getPublicKey, signTxIn } from "./util/transaction/sign";
import { getTransactionId } from "./util/transaction/transactionId";
import lodash from 'lodash';



const getBalance = (address: string, unspentTxOuts: UnspentTxOut[]): number => {
    return lodash(unspentTxOuts)
        .filter((uTxO: UnspentTxOut) => uTxO.address === address)
        .map((uTxO: UnspentTxOut) => uTxO.amount)
        .sum();
};

const findTxOutsForAmount = (amount: number, myUnspentTxOuts: UnspentTxOut[]) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return {includedUnspentTxOuts, leftOverAmount};
        }
    }
    throw Error('not enough coins to send transaction');
};

const createTxOuts = (receiverAddress: string, myAddress: string, amount:number, leftOverAmount: number) => {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

const createTransaction = (receiverAddress: string, amount: number,
                           privateKey: string, unspentTxOuts: UnspentTxOut[]): Transaction => {

    const myAddress: string = getPublicKey(privateKey);
    const myUnspentTxOuts = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    const {includedUnspentTxOuts, leftOverAmount} = findTxOutsForAmount(amount, myUnspentTxOuts);

    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
        const txIn: TxIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);

    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });

    return tx;
};


export {createTransaction,createTxOuts,findTxOutsForAmount,getBalance}