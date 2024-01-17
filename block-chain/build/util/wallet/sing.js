"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWallet = exports.getPublicFromWallet = exports.getPrivateFromWallet = void 0;
const elliptic_1 = require("elliptic");
const fs_1 = require("fs");
const EC = new elliptic_1.ec('secp256k1');
const privateKeyLocation = 'node/wallet/private_key_2';
const getPrivateFromWallet = () => {
    const buffer = (0, fs_1.readFileSync)(privateKeyLocation, 'utf8');
    return buffer.toString();
};
exports.getPrivateFromWallet = getPrivateFromWallet;
const getPublicFromWallet = () => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex', false);
};
exports.getPublicFromWallet = getPublicFromWallet;
const generatePrivateKey = () => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};
const initWallet = () => {
    // let's not override existing private keys
    if ((0, fs_1.existsSync)(privateKeyLocation)) {
        return;
    }
    const newPrivateKey = generatePrivateKey();
    (0, fs_1.writeFileSync)(privateKeyLocation, newPrivateKey);
    console.log('new wallet with private key created');
};
exports.initWallet = initWallet;
//# sourceMappingURL=sing.js.map