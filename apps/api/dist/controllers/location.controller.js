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
exports.LocationController = void 0;
const prisma_1 = __importDefault(require("src/prisma"));
class LocationController {
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield prisma_1.default.location.findMany({
                    select: {
                        locationName: true,
                        id: true,
                        event: {
                            select: {
                                categoryId: true,
                                id: true,
                                title: true,
                                location: {
                                    select: {
                                        id: true,
                                        locationName: true,
                                    }
                                },
                                images: {
                                    select: {
                                        id: true,
                                        path: true,
                                        eventId: true,
                                    },
                                },
                                description: true,
                                totalSeats: true,
                                price: true,
                                ticketType: true,
                                startTime: true,
                                endTime: true,
                                isDeleted: true,
                            },
                        },
                    },
                });
                res.status(200).send(locations); // Correctly sending the "locations" variable
            }
            catch (error) {
                // Log and send error response
                console.log('Error fetching locations:', error);
                res.status(500).send({ error: 'Error fetching locations' });
            }
        });
    }
}
exports.LocationController = LocationController;
