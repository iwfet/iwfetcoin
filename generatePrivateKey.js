
const  { ec } = require("elliptic")
const fs = require('fs');



const privateKeyLocation = 'node/wallet/private_key';
const EC = new ec('secp256k1');



const generatePrivatekey = () => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

const initWallet = () => {
    //let's not override existing private keys
    if (fs.existsSync(privateKeyLocation)) {
        return;
    }
    const newPrivateKey = generatePrivatekey();
    const key = EC.keyFromPrivate(newPrivateKey, 'hex');

    fs.writeFileSync("node/wallet/public_key", key.getPublic().encode('hex', false));
    
    fs.writeFileSync(privateKeyLocation, newPrivateKey);
    console.log('new wallet with private key created');
};


initWallet();

