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
exports.TransactionController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class TransactionController {
    createTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, eventId, qty, discountCode } = req.body;
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: parseInt(userId, 10) },
                });
                const event = yield prisma_1.default.event.findUnique({
                    where: { id: parseInt(eventId, 10) },
                });
                const discount = discountCode
                    ? yield prisma_1.default.discountcode.findFirst({ where: { code: discountCode } })
                    : null;
                if (!user || !event) {
                    return res.status(404).send({ message: 'User or event not found.' });
                }
                // Check if there enough seats available
                if (event.totalSeats < qty) {
                    return res.status(400).send({ message: 'Not enough seats available.' });
                }
                let totalPrice = event.price * qty;
                if (discount) {
                    totalPrice -= discount.amount;
                }
                // Check balance only if the user role is 'USER'
                if (user.role === 'USER') {
                    if (user.balance < totalPrice) {
                        return res.status(400).send({ message: 'Insufficient balance.' });
                    }
                }
                // Update user balance
                yield prisma_1.default.user.update({
                    where: { id: parseInt(userId, 10) },
                    data: { balance: user.balance - totalPrice },
                });
                // Update the number of available seats for the event
                yield prisma_1.default.event.update({
                    where: { id: parseInt(eventId, 10) },
                    data: { totalSeats: event.totalSeats - qty },
                });
                // Create the transaction
                const transaction = yield prisma_1.default.ticket.create({
                    data: {
                        userId: parseInt(userId, 10),
                        eventId: parseInt(eventId, 10),
                        qty,
                        total: totalPrice,
                        status: 'PAID',
                    },
                });
                res.send(transaction);
            }
            catch (error) {
                res
                    .status(500)
                    .send({ message: 'Failed to process transaction.', error });
            }
        });
    }
    readTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = res.locals.decrypt.id;
            try {
                // Fetch the user's transaction records
                const transactions = yield prisma_1.default.ticket.findMany({
                    where: {
                        userId: parseInt(userId, 10),
                    },
                    select: {
                        id: true,
                        userId: true,
                        qty: true,
                        eventId: true,
                        total: true,
                        status: true,
                        transactionDate: true,
                    },
                });
                // Return the transactions if found
                return res.status(200).send({
                    data: transactions,
                });
            }
            catch (error) {
                // Handle any errors during the query
                return res.status(500).send({
                    message: 'Error checking purchase status.',
                    error,
                });
            }
        });
    }
    updateTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { qty, discountCode } = req.body;
            try {
                const transaction = yield prisma_1.default.ticket.findUnique({
                    where: { id: parseInt(id, 10) },
                });
                if (!transaction) {
                    return res.status(404).send({ message: 'Transaction not found.' });
                }
                const event = yield prisma_1.default.event.findUnique({
                    where: { id: transaction.eventId },
                });
                const discount = discountCode
                    ? yield prisma_1.default.discountcode.findFirst({ where: { code: discountCode } })
                    : null;
                let totalPrice = event.price * qty;
                if (discount) {
                    totalPrice -= discount.amount;
                }
                const updatedTransaction = yield prisma_1.default.ticket.update({
                    where: { id: parseInt(id, 10) },
                    data: { qty, total: totalPrice },
                });
                res.send(updatedTransaction);
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    deleteTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.ticket.delete({
                    where: { id: parseInt(id, 10) },
                });
                res.send({ message: 'Transaction deleted successfully.' });
            }
            catch (error) {
                res.status(500).send({ message: 'Failed to delete transaction.', error });
            }
        });
    }
}
exports.TransactionController = TransactionController;
