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
exports.ProfileController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ProfileController {
    getProfileUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(res.locals.decrypt.id);
                if (res.locals.decrypt.id) {
                    const findUser = yield prisma_1.default.userprofile.findFirst({
                        where: {
                            userId: res.locals.decrypt.id,
                        },
                    });
                    if (!findUser) {
                        console.log('USER:', findUser);
                        return res.status(404).send({
                            success: false,
                            message: 'User not found',
                        });
                    }
                }
                const profile = yield prisma_1.default.userprofile.findMany({
                    where: { userId: res.locals.decrypt.id },
                    select: {
                        firstName: true,
                        lastName: true,
                        gender: true,
                        address: true,
                        phoneNumber: true,
                        dateOfBirth: true,
                        isAdded: true,
                        location: {
                            select: {
                                locationName: true,
                            },
                        },
                        user: {
                            select: {
                                email: true,
                                points: true,
                                identificationId: true,
                                balance: true,
                                referralCode: true,
                            },
                        },
                        image: true,
                    },
                });
                return res.status(200).send({
                    success: true,
                    result: profile,
                });
            }
            catch (error) {
                console.log(error);
                next({ success: false, message: 'Failed to get your information' });
            }
            `  `;
        });
    }
    addProfileUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { address, dateOfBirth, firstName, lastName, gender, location, phoneNumber, } = req.body;
                console.log(res.locals.decrypt);
                if (res.locals.decrypt.id) {
                    const findUser = yield prisma_1.default.user.findUnique({
                        where: {
                            id: res.locals.decrypt.id,
                        },
                    });
                    if (!findUser) {
                        return res.status(404).send({
                            succesS: false,
                            message: 'Profile not found',
                        });
                    }
                    const findLocation = yield prisma_1.default.location.findFirst({
                        where: {
                            locationName: location,
                        },
                    });
                    if (findLocation) {
                        const createProfile = yield prisma_1.default.userprofile.create({
                            data: {
                                userId: findUser.id,
                                address,
                                dateOfBirth: new Date(dateOfBirth).toISOString(),
                                firstName,
                                lastName,
                                gender,
                                phoneNumber,
                                isAdded: true,
                                image: `/assets/profile/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
                                locationId: findLocation === null || findLocation === void 0 ? void 0 : findLocation.id,
                            },
                        });
                        return res.status(200).send({
                            success: true,
                            message: 'successfully add your profile',
                            result: createProfile,
                        });
                    }
                    else {
                        const createLocation = yield prisma_1.default.location.create({
                            data: {
                                locationName: location,
                            },
                        });
                        const createProfile = yield prisma_1.default.userprofile.create({
                            data: {
                                userId: findUser.id,
                                address: address,
                                dateOfBirth: new Date(dateOfBirth).toISOString(),
                                firstName,
                                lastName,
                                phoneNumber,
                                gender,
                                image: `/assets/profile/${(_b = req.file) === null || _b === void 0 ? void 0 : _b.filename}`,
                                isAdded: true,
                                locationId: createLocation.id,
                            },
                        });
                        return res.status(200).send({
                            success: true,
                            message: 'successfully add your profile',
                            result: createProfile,
                        });
                    }
                }
                else {
                    return res.status(404).send({
                        success: false,
                        message: 'Token not found',
                        result: res.locals.decrypt.id,
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({
                    success: false,
                    message: error,
                });
            }
        });
    }
    updateProfileUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (res.locals.decrypt.id) {
                    const { address, firstName, lastName, gender, dateOfBirth, phoneNumber, } = req.body;
                    const findUser = yield prisma_1.default.userprofile.findFirst({
                        where: {
                            userId: res.locals.decrypt.id,
                        },
                    });
                    // If the user profile is not found, return an error
                    if (!findUser) {
                        return res.status(404).send({
                            success: false,
                            message: 'User profile not found',
                        });
                    }
                    if (findUser.image) {
                        const oldImagePath = path_1.default.join(__dirname, '../../public', findUser.image);
                        if (fs_1.default.existsSync(oldImagePath)) {
                            fs_1.default.unlinkSync(oldImagePath);
                        }
                    }
                    const updatedProfile = yield prisma_1.default.userprofile.update({
                        data: {
                            address: address ? address : findUser === null || findUser === void 0 ? void 0 : findUser.address,
                            firstName: firstName ? firstName : findUser === null || findUser === void 0 ? void 0 : findUser.firstName,
                            lastName: lastName ? lastName : findUser === null || findUser === void 0 ? void 0 : findUser.lastName,
                            gender: gender ? gender : findUser === null || findUser === void 0 ? void 0 : findUser.gender,
                            phoneNumber: phoneNumber ? phoneNumber : findUser === null || findUser === void 0 ? void 0 : findUser.phoneNumber,
                            dateOfBirth: dateOfBirth
                                ? new Date(dateOfBirth).toISOString()
                                : findUser === null || findUser === void 0 ? void 0 : findUser.dateOfBirth,
                            // image: req.file
                            //   ? `/assets/profile/${req.file?.filename}`
                            //   : findUser?.image,
                        },
                        where: {
                            id: findUser === null || findUser === void 0 ? void 0 : findUser.id,
                        },
                    });
                    return res.status(200).send({
                        success: false,
                        message: 'Profile updated succesfully',
                        result: updatedProfile,
                    });
                }
            }
            catch (error) {
                next({
                    success: false,
                    message: 'Cannot update your profile',
                    error,
                });
            }
        });
    }
}
exports.ProfileController = ProfileController;
