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
exports.EventService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class EventService {
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findUnique({
                where: {
                    id: userId,
                },
            });
        });
    }
    findLocationByName(locName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.location.findFirst({
                where: {
                    locationName: locName,
                },
            });
        });
    }
    findCategoryByName(catName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.category.findFirst({
                where: {
                    categoryName: catName,
                },
            });
        });
    }
    createCategory(catName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.category.create({
                data: {
                    categoryName: catName,
                },
            });
        });
    }
    createLocation(locName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.location.create({
                data: {
                    locationName: locName,
                },
            });
        });
    }
    createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.event.create({
                data,
                include: { images: true },
            });
        });
    }
    findUserEvents(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.event.findMany({
                where: { userId },
                select: {
                    title: true,
                    description: true,
                    price: true,
                    images: true,
                    startTime: true,
                    endTime: true,
                    location: { select: { locationName: true } },
                    ticketType: true,
                    category: { select: { categoryName: true } },
                    eventstatistic: {
                        select: {
                            totalAttendance: true,
                            totalRevenue: true,
                            totalTicketsSold: true,
                        },
                    },
                    seat: {
                        select: {
                            availableSeats: true,
                            totalSeats: true,
                        },
                    },
                    ticket: {
                        select: {
                            qty: true,
                            transactionDate: true,
                            total: true,
                        },
                    },
                },
            });
        });
    }
}
exports.EventService = EventService;
