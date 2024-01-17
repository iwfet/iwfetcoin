"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.getPublicKey = exports.signTxIn = void 0;
const ecdsa = __importStar(require("elliptic"));
const toHexString_1 = require("./toHexString");
const validateBlockTransactions_1 = require("./validateBlockTransactions");
const ec = new ecdsa.ec('secp256k1');
const signTxIn = (transaction, txInIndex, privateKey, aUnspentTxOuts) => {
    const txIn = transaction.txIns[txInIndex];
    const dataToSign = transaction.id;
    const referencedUnspentTxOut = (0, validateBlockTransactions_1.findUnspentTxOut)(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);
    if (referencedUnspentTxOut == undefined) {
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
    const signature = (0, toHexString_1.toHexString)(key.sign(dataToSign).toDER());
    return signature;
};
exports.signTxIn = signTxIn;
const getPublicKey = (aPrivateKey) => {
    const key = ec.keyFromPrivate(aPrivateKey, 'hex').getPublic();
    return key.encode('hex', false);
};
exports.getPublicKey = getPublicKey;
const verify = (address, transactionId, signature) => {
    const key = ec.keyFromPublic(address, 'hex');
    return key.verify(transactionId, signature);
};
exports.verify = verify;
//# sourceMappingURL=sign.js.map