"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRouter = void 0;
const profile_controller_1 = require("../controllers/profile.controller");
const uploader_1 = require("../middleware/uploader");
const verifyToken_1 = require("../middleware/verifyToken");
const express_1 = require("express");
class ProfileRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.profileController = new profile_controller_1.ProfileController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/profile', verifyToken_1.verifyToken, this.profileController.getProfileUser);
        this.router.post('/profile', verifyToken_1.verifyToken, (0, uploader_1.uploader)('/profile', 'USR').single('img'), this.profileController.addProfileUser);
        this.router.patch('/profile', verifyToken_1.verifyToken, (0, uploader_1.uploader)('/profile', 'USR').single('img'), this.profileController.updateProfileUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.ProfileRouter = ProfileRouter;
