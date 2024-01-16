"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const blockchain_1 = require("./blockchain");
const p2p_1 = require("./p2p");
const httpPort = 3001;
const p2pPort = 6001;
const initHttpServer = (myHttpPort) => {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.get('/blocks', (req, res) => {
        res.send((0, blockchain_1.getBlockchain)());
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock = (0, blockchain_1.generateNextBlock)(req.body.data);
        res.send(newBlock);
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
//# sourceMappingURL=main.js.map