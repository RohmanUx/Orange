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
exports.CategoryController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class CategoryController {
    // Create Category
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryName } = req.body;
                // ke database
                const newCategory = yield prisma_1.default.category.create({
                    data: {
                        categoryName,
                    },
                });
                res.status(201).send(newCategory);
            }
            catch (error) {
                console.log('Error buat kategori', error);
                res.status(500).send({ error: 'Error creating category' });
            }
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield prisma_1.default.category.findMany({
                    select: {
                        categoryName: true,
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
                res.status(200).send(categories);
            }
            catch (error) {
                // Log and send error response
                console.log('Error events by category:', error);
                res.status(500).send({ error: `Error events` });
            }
        });
    }
    // Get by id
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield prisma_1.default.category.findUnique({
                    where: { id: Number(id) },
                    include: {
                        event: true,
                    },
                });
                if (!category) {
                    return res.status(404).send({ error: 'Category not found' });
                }
                res.status(200).send(category);
            }
            catch (error) {
                res.status(500).send({ error: 'Error retrieving category' });
            }
        });
    }
    // Update Category
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { categoryName } = req.body;
                const updatedCategory = yield prisma_1.default.category.update({
                    where: { id: Number(id) },
                    data: { categoryName },
                });
                res.status(200).send(updatedCategory);
            }
            catch (error) {
                res.status(500).send({ error: 'Error updating category' });
            }
        });
    }
    // Delete Category
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.category.delete({
                    where: { id: Number(id) },
                });
                res.status(204).send(); // No content to send back
            }
            catch (error) {
                res.status(500).send({ error: 'Error deleting category' });
            }
        });
    }
}
exports.CategoryController = CategoryController;
