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
exports.PointBalanceController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class PointBalanceController {
    updateBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { balance, points } = req.body;
            try {
                const updatedUser = yield prisma_1.default.user.update({
                    where: { id: parseInt(userId, 10) },
                    data: { balance, points },
                });
                res.send(updatedUser);
            }
            catch (error) {
                res
                    .status(500)
                    .send({ message: 'Failed to update balance or points.', error });
            }
        });
    }
    createBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { userId } = req.params;
            const { points, balance } = req.body;
            const userId = res.locals.decrypt.id;
            if (!userId || isNaN(parseInt(userId, 10))) {
                return res.status(400).send({ message: 'Invalid or missing userId.' });
            }
            try {
                // First, check if the user already exists
                const existingUser = yield prisma_1.default.user.findUnique({
                    where: { id: parseInt(userId, 10) },
                });
                if (existingUser) {
                    // Update the existing user's balance
                    const updatedUser = yield prisma_1.default.user.update({
                        where: { id: parseInt(userId, 10) },
                        data: {
                            balance: existingUser.balance + (balance || 0), // Update balance
                            points: (existingUser.points || 0) + (points || 0), // Update points
                        },
                    });
                    res.status(200).send(updatedUser);
                }
                else {
                    res.status(500).send('fix it again');
                }
            }
            catch (error) {
                res
                    .status(500)
                    .send({ message: 'Failed to create or update user balance.', error });
            }
        });
    }
    getBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: parseInt(userId, 10) },
                    select: { balance: true, points: true },
                });
                if (!user) {
                    return res.status(404).send({ message: 'User not found.' });
                }
                res.send(user);
            }
            catch (error) {
                res.status(500).send({ message: 'Failed balance and points.', error });
            }
        });
    }
}
exports.PointBalanceController = PointBalanceController;
