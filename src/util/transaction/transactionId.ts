import { SHA256 } from "crypto-js";
import { Transaction } from "../../model/Transaction";
import { TxIn } from "../../model/TxIn";
import { TxOut } from "../../model/TxOut";

export const getTransactionId = (transaction: Transaction): string => {
    const txInContent: string = transaction.txIns
        .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
        .reduce((a, b) => a + b, '');

    const txOutContent: string = transaction.txOuts
        .map((txOut: TxOut) => txOut.address + txOut.amount)
        .reduce((a, b) => a + b, '');

    return SHA256(txInContent + txOutContent).toString();
};