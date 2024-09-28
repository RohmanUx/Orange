"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetLimiterOnSuccess = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later',
    },
    keyGenerator: (req) => req.ip || 'authKey',
});
const resetLimiterOnSuccess = (req, res, next) => {
    const key = req.ip || 'authKey';
    exports.limiter.resetKey(key);
    next();
};
exports.resetLimiterOnSuccess = resetLimiterOnSuccess;
