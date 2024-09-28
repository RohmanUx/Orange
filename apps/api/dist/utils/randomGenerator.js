"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomId = void 0;
const generateRandomId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
exports.generateRandomId = generateRandomId;
