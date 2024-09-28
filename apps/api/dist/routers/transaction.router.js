"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const verifyToken_1 = require("../middleware/verifyToken");
class TransactionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.transactionController = new transaction_controller_1.TransactionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/transaction', verifyToken_1.verifyToken, this.transactionController.createTransaction);
        this.router.get('/transaction/', verifyToken_1.verifyToken, this.transactionController.readTransaction);
        this.router.put('/transaction/:id', this.transactionController.updateTransaction);
        this.router.delete('/transaction/:id', this.transactionController.deleteTransaction);
    }
    getRouter() {
        return this.router;
    }
}
exports.TransactionRouter = TransactionRouter;
