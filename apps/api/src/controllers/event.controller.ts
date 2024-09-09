import prisma from '../prisma';
import { EventService } from '../services/event.services';
import { NextFunction, Request, Response } from 'express';

export class EventController {
  private eventService: EventService;
  constructor() {
    this.eventService = new EventService();
  }

  // get event from admin
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
  //     console.log(res.locals.decrypt.id);
  //     next({ success: false, message: ' event found' });
  //   }
  // }

  // select:
  // local.dcrypt
  // Multer.File[]
  // inclue:
  // where:
  // findMany

  // buat pagination navigation
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const offset = (page - 1) * limit;
      //
      const events = await prisma.event.findMany({
        skip: offset,
        take: limit,
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

      const totalEvents = await prisma.event.count();

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
    } catch (error) {
      console.log(error);
      next({
        error,
      });
    }
  }
  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.eventId);

      if (isNaN(eventId)) {
        return res.status(400).send({
          success: false,
          message: 'Invalid event ID',
        });
      }

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
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
    } catch (error) {
      console.log(error);
      next({
        error,
      });
    }
  }

  async addEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        description,
        category,
        price,
        totalSeats,
        location,
        ticketType,
        startTime,
        endTime,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !price ||
        !location ||
        !ticketType ||
        !startTime ||
        !endTime ||
        !totalSeats
      ) {
        return res
          .status(400)
          .send({ success: false, message: 'Missing required fields' });
      }

      // Check user existence
      const user = await this.eventService.findUserById(res.locals.decrypt.id);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: 'User not found' });
      }

      // handle file uploads
      const files = req.files as Express.Multer.File[];
      const imagePaths = files
        ? files.map((file) => `/assets/product/${file.filename}`)
        : [];

      // Check its create
      let categoryData = await this.eventService.findCategoryByName(category);
      let locationData = await this.eventService.findLocationByName(location);

      if (!categoryData) {
        categoryData = await this.eventService.createCategory(category);
      }

      if (!locationData) {
        locationData = await this.eventService.createLocation(location);
      }

      // to create event
      const eventPrice = ticketType === 'PAID' ? Number(price) : 0;

      // Create event list should there is
      const newEvent = await prisma.event.create({
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
    } catch (error) {
      console.error(error);
      next({ success: false, message: 'Failed to add event', error });
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const {
        title,
        description,
        category,
        totalSeats,
        price,
        location,
        ticketType,
        startTime,
        endTime,
      } = req.body;

      const findUser = await prisma.user.findUnique({
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

      const findUserEvent = await prisma.event.findFirst({
        where: {
          id: Number(eventId),
          userId: findUser.id,
        },
      });

      const findEventCategory = await prisma.category.findFirst({
        where: {
          id: findUserEvent?.categoryId,
        },
      });

      const findEventLocation = await prisma.location.findFirst({
        where: {
          id: findUserEvent?.locationId,
        },
      });

      if (!findUserEvent) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      const files = req.files as Express.Multer.File[];
      const imagePath =
        files.map((file) => `/assets/product/${file.filename}`) || [];

      const updateEvent = await prisma.event.update({
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
                : findEventLocation?.locationName,
            },
          },
          category: {
            update: {
              categoryName: category
                ? category
                : findEventCategory?.categoryName,
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
    } catch (error) {
      next({
        success: false,
        message: 'Cannot update event',
        error,
      });
    }
  } 
  
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
  
      // Decrypt the ID if it's encrypted, assuming it's done before this function
      const decryptedId = res.locals.decrypt.eventId;
      const { eventId } = req.params;
      // Delete the event using the decrypted ID
      const deletedEvent = await prisma.event.delete({
        where: {
          id: Number(eventId),
        },
      }); 

     const findId = await prisma.event.findFirst({
        where:{ 
          id: Number(eventId)
        }
     }) 
      // Send a success response back to the client
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
        data: deletedEvent,
      });
  
    } catch (error) {
      console.error('Error deleting event:', error);
  
      // Send an error response back to the client
      res.status(500).json({
        success: false,
        message: 'Failed to delete event',
              });
    }
  }
} 
