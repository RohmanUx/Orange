"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class TestimonialController {
    // // Middleware to check if the user is allowed to create a testimonial
    // private async canCreateTestimonial(userId: number, eventId: number): Promise<boolean> {
    //   // Check if the user has purchased the event
    //   const purchase = await prisma.ticket.findFirst({
    //     where: {
    //       userId: userId,
    //       eventId: eventId,
    //     },
    //   });
    //   if (!purchase) {
    //     return false;
    //   }
    //   // Check if the event is closed
    //   const event = await prisma.event.findUnique({
    //     where: { id: eventId },
    //   });
    //   if (!event || new Date() <= new Date(event.endTime)) {
    //     return false;
    //   }
    //   return true;
    // }
    // Create a testimonial
    createTestimonial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, eventId, reviewDescription, rating } = req.body;
            try {
                // // Check if the user can create a testimonial
                // const canCreate = await this.canCreateTestimonial(Number(userId), Number(eventId));
                // if (!canCreate) {
                //   return res.status(403).json({ message: 'You are not allowed to create a testimonial for this event.' });
                // }
                const testimonial = yield prisma_1.default.testimonial.create({
                    data: {
                        userId: Number(userId),
                        eventId: Number(eventId),
                        reviewDescription,
                        rating: Number(rating),
                    },
                });
                res.status(201).json(testimonial);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating testimonial', error });
            }
        });
    }
    // Read testimonials for a specific event
    readTestimonial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId } = req.params;
            try {
                const testimonials = yield prisma_1.default.testimonial.findMany({
                    where: { eventId: Number(eventId) },
                });
                res.status(200).json(testimonials);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching testimonials', error });
            }
        });
    }
    // Update a testimonial
    updateTestimonial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { reviewDescription, rating } = req.body;
            try {
                const testimonial = yield prisma_1.default.testimonial.update({
                    where: { id: Number(id) },
                    data: { reviewDescription, rating: Number(rating) },
                });
                res.status(200).json(testimonial);
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating testimonial', error });
            }
        });
    }
    // Delete a testimonial
    deleteTestimonial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.testimonial.delete({
                    where: { id: Number(id) },
                });
                res.status(200).json({ message: 'Testimonial deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting testimonial', error });
            }
        });
    }
}
exports.TestimonialController = TestimonialController;
//  example post 
// {
//   "userId": 1,
//   "eventId": 2,
//   "reviewDescription": "The event was amazing, well-organized, and very informative!",
//   "rating": 5
// }
// example writte json.body to output from field form json.body 
// have effect if event closed status and done buy user can comment because is before done buy event 
// around comment user can Crud card event if user needed 
// dont forget .json change .send to term code standar 
