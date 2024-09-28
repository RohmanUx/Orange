"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointBalanceRouter = void 0;
const verifyToken_1 = require("src/middleware/verifyToken");
const poin_balance_1 = require("../controllers/poin.balance");
const express_1 = require("express");
class PointBalanceRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.pointBalanceController = new poin_balance_1.PointBalanceController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.put('/user/:userId/', this.pointBalanceController.updateBalance);
        this.router.get('/user/:userId/', this.pointBalanceController.getBalance);
        this.router.post('/user/', verifyToken_1.verifyToken, this.pointBalanceController.createBalance);
    }
    getRouter() {
        return this.router;
    }
}
exports.PointBalanceRouter = PointBalanceRouter;
