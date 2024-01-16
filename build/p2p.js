"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSockets = exports.initP2PServer = exports.broadcastLatest = exports.connectToPeers = void 0;
const ws_1 = __importDefault(require("ws"));
const blockchain_1 = require("./blockchain");
const MessageType_1 = require("./enum/MessageType");
const JSONToObject_1 = require("./util/p2p/JSONToObject");
const valid_1 = require("./util/blockchain/valid");
const sockets = [];
const getSockets = () => sockets;
exports.getSockets = getSockets;
class Message {
}
const initP2PServer = (p2pPort) => {
    const server = new ws_1.default.Server({ port: p2pPort });
    server.on('connection', (ws) => {
        initConnection(ws);
    });
    console.log('listening websocket p2p port on: ' + p2pPort);
};
exports.initP2PServer = initP2PServer;
const initConnection = (ws) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
};
const initMessageHandler = (ws) => {
    ws.on('message', (data) => {
        const message = (0, JSONToObject_1.JSONToObject)(data);
        if (message === null) {
            console.log('could not parse received JSON message: ' + data);
            return;
        }
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType_1.MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType_1.MessageType.QUERY_ALL:
                write(ws, responseChainMsg());
                break;
            case MessageType_1.MessageType.RESPONSE_BLOCKCHAIN:
                const receivedBlocks = (0, JSONToObject_1.JSONToObject)(message.data);
                if (receivedBlocks === null) {
                    console.log('invalid blocks received:');
                    console.log(message.data);
                    break;
                }
                handleBlockchainResponse(receivedBlocks);
                break;
        }
    });
};
const write = (ws, message) => ws.send(JSON.stringify(message));
const broadcast = (message) => sockets.forEach((socket) => write(socket, message));
const queryChainLengthMsg = () => ({ 'type': MessageType_1.MessageType.QUERY_LATEST, 'data': null });
const queryAllMsg = () => ({ 'type': MessageType_1.MessageType.QUERY_ALL, 'data': null });
const responseChainMsg = () => ({
    'type': MessageType_1.MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify((0, blockchain_1.getBlockchain)())
});
const responseLatestMsg = () => ({
    'type': MessageType_1.MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([(0, blockchain_1.getLatestBlock)()])
});
const initErrorHandler = (ws) => {
    const closeConnection = (myWs) => {
        console.log('connection failed to peer: ' + myWs.url);
        sockets.splice(sockets.indexOf(myWs), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};
const handleBlockchainResponse = (receivedBlocks) => {
    if (receivedBlocks.length === 0) {
        console.log('received block chain size of 0');
        return;
    }
    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    if (!(0, valid_1.isValidBlockStructure)(latestBlockReceived)) {
        console.log('block structuture not valid');
        return;
    }
    const latestBlockHeld = (0, blockchain_1.getLatestBlock)();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: '
            + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            if ((0, blockchain_1.addBlockToChain)(latestBlockReceived)) {
                broadcast(responseLatestMsg());
            }
        }
        else if (receivedBlocks.length === 1) {
            console.log('We have to query the chain from our peer');
            broadcast(queryAllMsg());
        }
        else {
            console.log('Received blockchain is longer than current blockchain');
            (0, blockchain_1.replaceChain)(receivedBlocks);
        }
    }
    else {
        console.log('received blockchain is not longer than received blockchain. Do nothing');
    }
};
const broadcastLatest = () => {
    broadcast(responseLatestMsg());
};
exports.broadcastLatest = broadcastLatest;
const connectToPeers = (newPeer) => {
    const ws = new ws_1.default(newPeer);
    ws.on('open', () => {
        initConnection(ws);
    });
    ws.on('error', () => {
        console.log('connection failed');
    });
};
exports.connectToPeers = connectToPeers;
//# sourceMappingURL=p2p.js.map