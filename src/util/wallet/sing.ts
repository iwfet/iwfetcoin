import { ec } from "elliptic";
import {existsSync, readFileSync,  writeFileSync,unlinkSync} from 'fs';

const EC = new ec('secp256k1');
const privateKeyLocation = 'node/wallet/private_key';

const getPrivateFromWallet = (): string => {
    const buffer = readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
};

const getPublicFromWallet = (): string => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex', false);
};

const generatePrivateKey = (): string => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

const initWallet = () => {
    // let's not override existing private keys
    if (existsSync(privateKeyLocation)) {
        return;
    }
    const newPrivateKey = generatePrivateKey();
  
    writeFileSync(privateKeyLocation, newPrivateKey);
    writeFileSync("node/wallet/public_key", getPublicFromWallet());
    console.log('new wallet with private key created');
};



const deleteWallet = () => {
    if (existsSync(privateKeyLocation)) {
        unlinkSync(privateKeyLocation);
    }
};

export {getPrivateFromWallet,getPublicFromWallet,initWallet,deleteWallet }
