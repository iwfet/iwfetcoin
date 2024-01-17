import { Transaction } from "../../model/Transaction";
import { TxIn } from "../../model/TxIn";
import { UnspentTxOut } from "../../model/UnspentTxOut";
import { verify } from "./sign";

const validateTxIn = (txIn: TxIn, transaction: Transaction, aUnspentTxOuts: UnspentTxOut[]): boolean => {
    const referencedUTxOut: UnspentTxOut | undefined =aUnspentTxOuts.find((uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutId === txIn.txOutId);
    if (referencedUTxOut == undefined) {
        console.log('referenced txOut not found: ' + JSON.stringify(txIn));
        return false;
    }
    const address = referencedUTxOut.address;
    return verify(address,transaction.id, txIn.signature)
};



export {validateTxIn}