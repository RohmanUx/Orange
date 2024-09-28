"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uploader = (dirName, prefixName) => {
    // Base directory for file storage
    const mainDir = path_1.default.join(__dirname, '../../public');
    // Configure storage for multer
    const configFileStore = multer_1.default.diskStorage({
        destination: (req, file, callback) => {
            // Resolve the destination directory path
            const fileDest = dirName ? path_1.default.join(mainDir, dirName) : mainDir;
            callback(null, fileDest);
        },
        filename: (req, file, callback) => {
            // Generate unique filename
            const ext = path_1.default.extname(file.originalname);
            const baseName = path_1.default.basename(file.originalname, ext);
            callback(null, `${prefixName || 'MEDIA'}_${Date.now()}${ext}`);
        },
    });
    return (0, multer_1.default)({
        storage: configFileStore,
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
    });
};
exports.uploader = uploader;
