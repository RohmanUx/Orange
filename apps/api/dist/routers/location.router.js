"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRouter = void 0;
const express_1 = require("express");
const location_controller_1 = require("src/controllers/location.controller");
class LocationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.locationController = new location_controller_1.LocationController();
        this.configuration();
    }
    configuration() {
        this.router.get('/location/', this.locationController.get);
    }
    getRouter() {
        return this.router;
    }
}
exports.LocationRouter = LocationRouter;
