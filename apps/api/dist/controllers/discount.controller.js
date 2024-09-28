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
exports.DiscountController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class DiscountController {
    createDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, amount, validFrom, validTo, limit, codeStatus } = req.body;
            try {
                const newDiscount = yield prisma_1.default.discountcode.create({
                    data: {
                        code,
                        amount,
                        validFrom: new Date(validFrom),
                        validTo: new Date(validTo),
                        limit,
                        codeStatus,
                    },
                });
                res.send(newDiscount);
            }
            catch (error) {
                res.status(500).send({ message: 'Failed create discount code.', error });
            }
        });
    }
    readDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const discount = yield prisma_1.default.discountcode.findUnique({
                    where: { id: parseInt(id, 10) },
                });
                if (!discount) {
                    return res.status(404).send({ message: 'Discount not found.' });
                }
                res.send(discount);
            }
            catch (error) {
                res.status(500).send({ message: 'Failed discount code.', error });
            }
        });
    }
    updateDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { code, amount, validFrom, validTo, limit, codeStatus } = req.body;
            try {
                const discount = yield prisma_1.default.discountcode.update({
                    where: { id: parseInt(id, 10) },
                    data: {
                        code,
                        amount,
                        validFrom: new Date(validFrom),
                        validTo: new Date(validTo),
                        limit,
                        codeStatus,
                    },
                });
                res.send(discount);
            }
            catch (error) {
                res.status(500).send({ message: 'Failed update discount code.', error });
            }
        });
    }
    deleteDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.discountcode.delete({
                    where: { id: parseInt(id, 10) },
                });
                // mencari & hapus . entri = 10  decimal di prisama
                res.send({ message: 'Discount code deleted successfully.' });
            }
            catch (error) {
                res
                    .status(500)
                    .send({ message: 'Failed to delete discount code.', error });
            }
        });
    }
}
exports.DiscountController = DiscountController;
