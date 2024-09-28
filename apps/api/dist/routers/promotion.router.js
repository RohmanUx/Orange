"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRouter = void 0;
const express_1 = require("express");
const promotion_contoroller_1 = require("../controllers/promotion.contoroller");
class PromotionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.promotionController = new promotion_contoroller_1.PromotionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //   this.router.post('/promotion', this.promotionController.createPromotion);
        //   this.router.get('/promotion/:id', this.promotionController.getPromotion);
        //   this.router.put('/promotion/:id', this.promotionController.updatePromotion);
        //   this.router.delete('/promotion/:id', this.promotionController.deletePromotion);
        //   this.router.post('/promotion/apply', this.promotionController.applyPromotion);
    }
    getRouter() {
        return this.router;
    }
}
exports.PromotionRouter = PromotionRouter;
