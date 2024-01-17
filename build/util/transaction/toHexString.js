"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHexString = void 0;
const toHexString = (byteArray) => {
    return Array.from(byteArray, (byte) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};
exports.toHexString = toHexString;
//# sourceMappingURL=toHexString.js.map