import { Transaction } from "../../model/Transaction";
import { TxIn } from "../../model/TxIn";
import * as ecdsa from 'elliptic';
import { toHexString } from "./toHexString";
import { findUnspentTxOut } from "./validateBlockTransactions";
import { UnspentTxOut } from "../../model/UnspentTxOut";


const ec = new ecdsa.ec('secp256k1');

const signTxIn = (transaction: Transaction, txInIndex: number, privateKey: string, aUnspentTxOuts: UnspentTxOut[]): string => {

    const txIn: TxIn = transaction.txIns[txInIndex];
    const dataToSign:string = transaction.id;
    const referencedUnspentTxOut: UnspentTxOut |undefined = findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);

    if(referencedUnspentTxOut == undefined) {
        console.log('could not find referenced txOut');
        throw Error();
    }

    const referencedAddress = referencedUnspentTxOut.address;

    if (getPublicKey(privateKey) !== referencedAddress) {
        console.log('trying to sign an input with private' +
            ' key that does not match the address that is referenced in txIn');
        throw Error();
    }

    const key = ec.keyFromPrivate(privateKey, 'hex');
    const signature: string = toHexString(key.sign(dataToSign).toDER());
    return signature;
};


const getPublicKey = (aPrivateKey: string): string => {
    const key =  ec.keyFromPrivate(aPrivateKey, 'hex').getPublic()
    return key.encode('hex', false);
};



const verify = (address:string,transactionId:string, signature:string):boolean => {
    const key = ec.keyFromPublic(address, 'hex');
    return key.verify(transactionId, signature);
}




export {signTxIn, getPublicKey,verify};

