"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONToObject = void 0;
const JSONToObject = (data) => {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
exports.JSONToObject = JSONToObject;
//# sourceMappingURL=JSONToObject.js.map