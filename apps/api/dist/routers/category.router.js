"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const category_controller_1 = require("../controllers/category.controller");
const express_1 = require("express");
class CategoryRouter {
    constructor() {
        this.categoryConteroller = new category_controller_1.CategoryController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/categories", this.categoryConteroller.createCategory);
        this.router.get("/categories", this.categoryConteroller.getCategories);
        this.router.get("/categories/:id", this.categoryConteroller.getCategoryById);
        this.router.put("/categories/:id", this.categoryConteroller.updateCategory);
        this.router.delete("/categories/:id", this.categoryConteroller.deleteCategory);
    }
    getRouter() {
        return this.router;
    }
}
exports.CategoryRouter = CategoryRouter;
