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
exports.registerValidation = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('format email is wrong'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
    })
        .withMessage('Password must contain minimum 8 characters, at least one uppercase, one lowercase, one number')
        .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
        const findExistedEmail = yield prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (findExistedEmail) {
            throw new Error('Email is already in use');
        }
        return true;
    })),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty()
        .withMessage('confirm password is required')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('confirm password does not match password');
        }
        return true;
    }),
    (0, express_validator_1.body)('role').notEmpty().withMessage('please choose a role'),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req);
        if (!errorValidator.isEmpty()) {
            return res.status(400).send({
                success: false,
                error: errorValidator,
            });
        }
        next();
    },
];
