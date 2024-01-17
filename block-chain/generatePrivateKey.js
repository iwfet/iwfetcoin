
const { log } = require("console");
const  { ec } = require("elliptic")
const EC = new ec('secp256k1');


const generatePrivatekey = () => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

const initWallet = () => {
    const newPrivateKey = generatePrivatekey();
    const key = EC.keyFromPrivate(newPrivateKey, 'hex');

    log(key.getPublic().encode('hex', false));
    
     log("private",newPrivateKey);

};


initWallet();

