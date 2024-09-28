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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const emailResetPass_1 = require("../utils/emailResetPass");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const randomGenerator_1 = require("../utils/randomGenerator");
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
class AuthController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email, password, confirmPassword, refCode, role } = req.body;
                const existingUser = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists. Please choose another email.',
                    });
                }
                const referralCode = (0, uuid_1.v4)().substring(0, 8);
                const identificationId = (0, randomGenerator_1.generateRandomId)();
                if (refCode) {
                    const referrer = yield prisma_1.default.user.findFirst({
                        where: { referralCode: refCode },
                    });
                    if (referrer) {
                        const updatedPoints = Math.round(Number(referrer.points) + 10000);
                        const validTo = new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString();
                        const discountCode = (0, randomGenerator_1.generateRandomId)();
                        yield prisma_1.default.point.create({
                            data: {
                                userId: referrer.id,
                                amount: 10000,
                                validFrom: new Date().toISOString(),
                                validTo,
                            },
                        });
                        yield prisma_1.default.discountcode.create({
                            data: {
                                code: discountCode,
                                amount: 5000,
                                validFrom: new Date().toISOString(),
                                validTo,
                                codeStatus: 'AVAILABLE',
                                limit: 1,
                            },
                        });
                    }
                }
                const newUser = yield prisma_1.default.user.create({
                    data: {
                        email,
                        password: yield (0, hash_1.hashPassword)(password),
                        identificationId,
                        referralCode,
                        referredBy: refCode
                            ? (_a = (yield prisma_1.default.user.findFirst({
                                where: { referralCode: refCode },
                            }))) === null || _a === void 0 ? void 0 : _a.id
                            : null,
                        role,
                        balance: 0,
                    },
                });
                const token = (0, jwt_1.createToken)({ id: newUser.id, email: newUser.email }, '24h');
                return res.status(201).json({
                    success: true,
                    message: 'Your account has been created.',
                    result: {
                        email: newUser.email,
                        token,
                        identificationId,
                        referralCode,
                    },
                });
            }
            catch (error) {
                console.error(error);
                next({
                    success: false,
                    message: 'Failed to register.',
                });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Log incoming email and request (you may remove this in production)
                console.log('Login attempt with email:', email);
                // Find user by email
                const user = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid email or password.',
                    });
                }
                // Compare password with stored hash
                const isPasswordValid = (0, bcrypt_1.compareSync)(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid email or password.',
                    });
                }
                // Create JWT token
                let token;
                try {
                    token = (0, jwt_1.createToken)({ id: user.id, email: user.email }, '24h');
                }
                catch (tokenError) {
                    console.error('Token generation error:', tokenError);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to generate token.',
                    });
                }
                // Success response
                return res.status(200).json({
                    success: true,
                    result: {
                        role: user.role,
                        id: user.id,
                        identificationId: user.identificationId,
                        email: user.email,
                        points: user.points,
                        token,
                    },
                });
            }
            catch (error) {
                console.error('Login error:', error); // Log the full error for debugging
                return res.status(500).json({
                    success: false,
                    message: 'Failed to login.',
                    error: error,
                });
            }
        });
    }
    keepLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = res.locals.decrypt.id;
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: userId },
                });
                const profile = yield prisma_1.default.userprofile.findFirst({
                    where: { userId },
                });
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Account not found.',
                    });
                }
                const token = (0, jwt_1.createToken)({ id: user.id, email: user.email }, '24h');
                return res.status(200).json({
                    success: true,
                    result: {
                        email: user.email,
                        identificationId: user.identificationId,
                        role: user.role,
                        points: user.points,
                        balance: user.balance,
                        image: profile === null || profile === void 0 ? void 0 : profile.image,
                        token,
                    },
                });
            }
            catch (error) {
                console.error(error);
                next({ success: false, message: 'Failed to fetch user data.' });
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Account not found.',
                    });
                }
                const token = (0, jwt_1.createToken)({ id: user.id, email: user.email }, '20m');
                yield (0, emailResetPass_1.sendEmail)(user.email, 'Password Reset', null, {
                    email: user.email,
                    token,
                });
                return res.status(200).json({
                    success: true,
                    message: 'Password reset email sent.',
                    result: { token },
                });
            }
            catch (error) {
                console.error(error);
                next({
                    success: false,
                    message: 'Failed to send password reset email.',
                    error,
                });
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                if (!res.locals.decrypt.id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid token.',
                    });
                }
                yield prisma_1.default.user.update({
                    where: { id: res.locals.decrypt.id },
                    data: { password: yield (0, hash_1.hashPassword)(password) },
                });
                return res.status(200).json({
                    success: true,
                    message: 'Password reset successfully. Please login.',
                });
            }
            catch (error) {
                console.error(error);
                next({ success: false, message: 'Failed to reset password.', error });
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Optionally implement token blacklist logic here
                return res.status(200).json({
                    success: true,
                    message: 'Logged out successfully.',
                });
            }
            catch (error) {
                console.error(error);
                next({ success: false, message: 'Failed to logout.', error });
            }
        });
    }
}
exports.AuthController = AuthController;
