import { Transaction } from "./model/Transaction";
import { TxIn } from "./model/TxIn";
import { TxOut } from "./model/TxOut";
import { UnspentTxOut } from "./model/UnspentTxOut";
import { isValidTransactionsStructure } from "./util/transaction/isValidTransactionsStructure";
import { getTransactionId } from "./util/transaction/transactionId";
import { updateUnspentTxOuts } from "./util/transaction/updateUnspentTxOuts";
import { validateBlockTransactions } from "./util/transaction/validateBlockTransactions";

const COINBASE_AMOUNT: number = 50;

const processTransactions = (aTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[], blockIndex: number) => {

    if (!isValidTransactionsStructure(aTransactions)) {
        return null;
    }

    if (!validateBlockTransactions(aTransactions, aUnspentTxOuts, blockIndex)) {
        console.log('invalid block transactions');
        return null;
    }
    return updateUnspentTxOuts(aTransactions, aUnspentTxOuts);
};

const getCoinbaseTransaction = (address: string, blockIndex: number): Transaction => {
    const t = new Transaction();
    const txIn: TxIn = new TxIn();
    txIn.signature = "";
    txIn.txOutId = "";
    txIn.txOutIndex = blockIndex;

    t.txIns = [txIn];
    t.txOuts = [new TxOut(address, COINBASE_AMOUNT)];
    t.id = getTransactionId(t);
    return t;
};

export {processTransactions, COINBASE_AMOUNT,getCoinbaseTransaction}