"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialRouter = void 0;
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
class TestimonialRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.testimonialController = new testimonial_controller_1.TestimonialController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/testimonial/', this.testimonialController.createTestimonial);
        this.router.get('/testimonial/:eventId', this.testimonialController.readTestimonial);
        this.router.put('/testimonial/:id', this.testimonialController.updateTestimonial);
        this.router.delete('/testimonial/:id', this.testimonialController.deleteTestimonial);
    }
    getRouter() {
        return this.router;
    }
}
exports.TestimonialRouter = TestimonialRouter;
