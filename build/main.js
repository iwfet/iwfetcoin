"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const blockchain_1 = require("./blockchain");
const p2p_1 = require("./p2p");
const sing_1 = require("./util/wallet/sing");
const httpPort = 3005;
const p2pPort = 6005;
const initHttpServer = (myHttpPort) => {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use((err, req, res, next) => {
        if (err) {
            res.status(400).send(err.message);
        }
    });
    app.get('/blocks', (req, res) => {
        res.send((0, blockchain_1.getBlockchain)());
    });
    app.post('/mineRawBlock', (req, res) => {
        if (req.body.data == null) {
            res.send('data parameter is missing');
            return;
        }
        const newBlock = (0, blockchain_1.generateRawNextBlock)(req.body.data);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock = (0, blockchain_1.generateNextBlock)();
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.get('/balance', (req, res) => {
        const balance = (0, blockchain_1.getAccountBalance)();
        res.send({ 'balance': balance });
    });
    app.post('/mineTransaction', (req, res) => {
        const address = req.body.address;
        const amount = req.body.amount;
        try {
            const resp = (0, blockchain_1.generatenextBlockWithTransaction)(address, amount);
            res.send(resp);
        }
        catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });
    app.get('/peers', (req, res) => {
        res.send((0, p2p_1.getSockets)().map((s) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        (0, p2p_1.connectToPeers)(req.body.peer);
        res.send();
    });
    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
initHttpServer(httpPort);
(0, p2p_1.initP2PServer)(p2pPort);
(0, sing_1.initWallet)();
//# sourceMappingURL=main.js.map