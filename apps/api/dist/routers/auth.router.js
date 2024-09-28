"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const loginLimiter_1 = require("../middleware/limiter/loginLimiter");
const auth_controller_1 = require("../controllers/auth.controller");
const forgotPassword_1 = require("../middleware/validator/forgotPassword");
const login_1 = require("../middleware/validator/login");
const resetPassword_1 = require("../middleware/validator/resetPassword");
const verifyToken_1 = require("../middleware/verifyToken");
const express_1 = require("express");
class AuthRouter {
    constructor() {
        this.authController = new auth_controller_1.AuthController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/login', login_1.loginValidation, loginLimiter_1.limiter, loginLimiter_1.resetLimiterOnSuccess, this.authController.login);
        this.router.get('/keeplogin', verifyToken_1.verifyToken, this.authController.keepLogin);
        this.router.post('/forgot-password', forgotPassword_1.forgotPassValidation, this.authController.forgotPassword);
        this.router.patch('/reset-password', resetPassword_1.resetPassValidation, verifyToken_1.verifyToken, this.authController.resetPassword);
        this.router.post('/register', 
        // registerValidation,
        this.authController.register);
        this.router.post('/logout', this.authController.logout);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
