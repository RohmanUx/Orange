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
exports.EventController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const event_services_1 = require("../services/event.services");
class EventController {
    constructor() {
        this.eventService = new event_services_1.EventService();
    }
    // // get event from admin
    // async getUserEvent(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     if (!res.locals.decrypt.id) {
    //       return res.status(404).send({
    //         success: false,
    //         message: 'not find token',
    //       });
    //     }
    //     return res.status(200).send({
    //       success: true,
    //       massage: 'there is read event',
    //     });
    //   } catch (error) {
    //     console.log(res.locals.decrypt.d);
    //     next({ success: false, message: ' event found' });
    //   }
    // }
    // select
    // local.dcryp
    // Multer.File[
    // inclue
    // where
    // findMan
    // buat pagination navigatio
    // to all event show
    getAllEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                // const { userId } = res.locals.decrypt.id;
                const offset = (page - 1) * limit;
                //       const whereCondition: Prisma.eventWhereInput | undefined =
                // role === 'ADMIN' ? undefined : { userId };
                const events = yield prisma_1.default.event.findMany({
                    skip: offset,
                    take: limit,
                    //  where: whereCondition,
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        startTime: true,
                        endTime: true,
                        statusEvent: true,
                        price: true,
                        totalSeats: true,
                        isDeleted: true,
                        images: {
                            select: {
                                path: true,
                            },
                        },
                        category: {
                            select: {
                                categoryName: true,
                            },
                        },
                        location: {
                            select: {
                                locationName: true,
                            },
                        },
                    },
                });
                console.log(events, 'hallo hai');
                const totalEvents = yield prisma_1.default.event.count({
                // where: whereCondition,
                });
                return res.status(200).send({
                    success: true,
                    message: 'Events successfully',
                    data: events,
                    pagination: {
                        total: totalEvents,
                        page,
                        limit,
                        totalPages: Math.ceil(totalEvents / limit),
                    },
                });
            }
            catch (error) {
                console.log(error);
                next({
                    error,
                });
            }
        });
    }
    getEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(res.locals.decrypt.id); // Assuming the event ID is passed as a route parameter
                // const eventId  = req.params
                if (isNaN(userId)) {
                    return res.status(400).send({
                        success: false,
                        message: 'Invalid event ID',
                    });
                }
                const event = yield prisma_1.default.event.findMany({
                    where: {
                        userId: userId, // Use event ID for the query
                        isDeleted: false, // Optional: only fetch non-deleted events
                    },
                    select: {
                        id: true,
                        title: true,
                        userId: true,
                        description: true,
                        startTime: true,
                        endTime: true,
                        statusEvent: true,
                        price: true,
                        totalSeats: true,
                        ticketType: true,
                        images: {
                            select: {
                                path: true,
                            },
                        },
                        category: {
                            select: {
                                categoryName: true,
                            },
                        },
                        location: {
                            select: {
                                locationName: true,
                            },
                        },
                    },
                });
                // Check if the event was found
                if (!event) {
                    return res.status(404).send({
                        success: false,
                        message: 'Event not found',
                    });
                }
                // Return the event data
                return res.status(200).send({
                    success: true,
                    message: 'Event retrieved successfully',
                    data: event,
                });
            }
            catch (error) {
                console.error(error);
                return next({
                    status: 500,
                    message: 'An error occurred while retrieving the event',
                    // Provide the error message for debugging
                });
            }
        });
    }
    addEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, category, price, totalSeats, location, ticketType, startTime, endTime, } = req.body;
                if (!title ||
                    !description ||
                    !category ||
                    !price ||
                    !location ||
                    !ticketType ||
                    !startTime ||
                    !endTime ||
                    !totalSeats) {
                    return res
                        .status(400)
                        .send({ success: false, message: 'Missing required fields' });
                }
                // Check user existence
                const user = yield this.eventService.findUserById(res.locals.decrypt.id);
                if (!user) {
                    return res
                        .status(404)
                        .send({ success: false, message: 'User not found' });
                }
                // handle file uploads
                const files = req.files;
                const imagePaths = files
                    ? files.map((file) => `/assets/product/${file.filename}`)
                    : [];
                // Check its create
                let categoryData = yield this.eventService.findCategoryByName(category);
                let locationData = yield this.eventService.findLocationByName(location);
                if (!categoryData) {
                    categoryData = yield this.eventService.createCategory(category);
                }
                if (!locationData) {
                    locationData = yield this.eventService.createLocation(location);
                }
                // to create event
                const eventPrice = ticketType === 'PAID' ? Number(price) : 0;
                // Create event list should there is
                const newEvent = yield prisma_1.default.event.create({
                    data: {
                        title,
                        description,
                        totalSeats: Number(totalSeats),
                        price: eventPrice,
                        ticketType,
                        startTime: new Date(startTime),
                        endTime: new Date(endTime),
                        userId: user.id,
                        categoryId: categoryData.id,
                        locationId: locationData.id,
                        images: { create: imagePaths.map((path) => ({ path })) },
                        isDeleted: false,
                    },
                    include: { images: true },
                });
                console.log('Event created successfully', newEvent);
                return res.status(201).send({ success: true, result: newEvent });
            }
            catch (error) {
                console.log(error);
                next({ success: false, message: 'Failed to add event', error });
            }
        });
    }
    updateEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const { title, description, category, totalSeats, price, location, ticketType, startTime, endTime, } = req.body;
                const findUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: res.locals.decrypt.id,
                    },
                });
                if (title) {
                    console.log('succest title found');
                }
                if (!findUser) {
                    return res.status(404).send({
                        success: false,
                        message: 'User not found',
                    });
                }
                const findUserEvent = yield prisma_1.default.event.findFirst({
                    where: {
                        id: Number(eventId),
                        userId: findUser.id,
                    },
                });
                const findEventCategory = yield prisma_1.default.category.findFirst({
                    where: {
                        id: findUserEvent === null || findUserEvent === void 0 ? void 0 : findUserEvent.categoryId,
                    },
                });
                const findEventLocation = yield prisma_1.default.location.findFirst({
                    where: {
                        id: findUserEvent === null || findUserEvent === void 0 ? void 0 : findUserEvent.locationId,
                    },
                });
                if (!findUserEvent) {
                    return res.status(404).send({
                        success: false,
                        message: 'User not found',
                    });
                }
                const files = req.files;
                const imagePath = files.map((file) => `/assets/product/${file.filename}`) || [];
                const updateEvent = yield prisma_1.default.event.update({
                    data: {
                        price: price ? Number(price) : findUserEvent.price,
                        title: title ? title : findUserEvent.title,
                        startTime: startTime
                            ? new Date(startTime).toISOString()
                            : findUserEvent.startTime,
                        endTime: endTime
                            ? new Date(endTime).toISOString()
                            : findUserEvent.endTime,
                        ticketType: ticketType ? ticketType : findUserEvent.ticketType,
                        description: description ? description : findUserEvent.description,
                        location: {
                            update: {
                                locationName: location
                                    ? location
                                    : findEventLocation === null || findEventLocation === void 0 ? void 0 : findEventLocation.locationName,
                            },
                        },
                        category: {
                            update: {
                                categoryName: category
                                    ? category
                                    : findEventCategory === null || findEventCategory === void 0 ? void 0 : findEventCategory.categoryName,
                            },
                        },
                        images: {
                            create: imagePath.map((path) => ({ path })) || null,
                        },
                    },
                    where: {
                        id: findUserEvent.id,
                    },
                    include: {
                        images: true,
                    },
                });
                return res.status(200).send({
                    success: true,
                    message: 'Event updated successfull',
                });
            }
            catch (error) {
                next({
                    success: false,
                    message: 'Cannot update event',
                    error,
                });
            }
        });
    }
    // Delete event controller
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const { userId } = res.locals.decrypt.id;
                // First, find the event by its ID
                const event = yield prisma_1.default.event.findFirst({
                    where: {
                        id: parseInt(eventId),
                        userId: userId,
                    },
                });
                if (!event) {
                    return res.status(404).json({
                        message: 'Event not found',
                    });
                }
                // Soft delete the event if it's not deleted yet
                if (!event.isDeleted) {
                    yield prisma_1.default.event.update({
                        where: { id: parseInt(eventId) },
                        data: { isDeleted: true },
                    });
                    return res.status(200).json({
                        message: 'Event soft deleted successfully',
                    });
                }
                // If the event is already soft deleted, handle hard deletion
                if (event.isDeleted) {
                    try {
                        yield prisma_1.default.event.delete({
                            where: { id: parseInt(eventId) },
                        });
                        yield prisma_1.default.image.deleteMany({
                            where: { eventId: parseInt(eventId) },
                        });
                        return res.status(200).json({
                            message: 'Event hard deleted successfully',
                        });
                    }
                    catch (error) {
                        console.error('Error during hard delete:', error);
                        return res.status(500).json({
                            message: 'Failed to hard delete event due to foreign key constraints',
                        });
                    }
                }
            }
            catch (error) {
                console.error('Error deleting event:', error);
                return res.status(500).json({
                    message: 'An error occurred while deleting the event',
                });
            }
        });
    }
}
exports.EventController = EventController;
