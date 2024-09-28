"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRouter = void 0;
const express_1 = require("express");
const discount_controller_1 = require("../../src/controllers/discount.controller");
class DiscountRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.discountController = new discount_controller_1.DiscountController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/discount', this.discountController.createDiscount);
        this.router.get('/discount/:id', this.discountController.readDiscount);
        this.router.put('/discount/:id', this.discountController.updateDiscount);
        this.router.delete('/discount/:id', this.discountController.deleteDiscount);
    }
    getRouter() {
        return this.router;
    }
}
exports.DiscountRouter = DiscountRouter;
