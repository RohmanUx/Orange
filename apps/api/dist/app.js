"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const auth_router_1 = require("./routers/auth.router");
const profile_router_1 = require("./routers/profile.router");
const events_router_1 = require("./routers/events.router");
const transaction_router_1 = require("./routers/transaction.router");
const location_router_1 = require("./routers/location.router");
const testimonial_router_1 = require("./routers/testimonial.router");
const discount_route_1 = require("./routers/discount.route");
const promotion_router_1 = require("./routers/promotion.router");
const path_1 = __importDefault(require("path"));
const point_balance_1 = require("./routers/point.balance");
const category_router_1 = require("./routers/category.router"); // Import CategoryRouter
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.handleError();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, express_1.json)());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
        this.app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../public')));
    }
    handleError() {
        // Handle 404 errors
        this.app.use((req, res, next) => {
            if (req.path.includes('/api/')) {
                res.status(404).send('Not found!');
            }
            else {
                next();
            }
        });
        // Handle 500 errors
        this.app.use((err, req, res, next) => {
            if (req.path.includes('/api/')) {
                console.log('Error : ', err.stack);
                res.status(500).send('Error !');
            }
            else {
                next();
            }
        });
    }
    routes() {
        const authRouter = new auth_router_1.AuthRouter();
        const profileRouter = new profile_router_1.ProfileRouter();
        const eventRouter = new events_router_1.EventRouter();
        const transactionRouter = new transaction_router_1.TransactionRouter();
        const testimonialRouter = new testimonial_router_1.TestimonialRouter();
        const discountRouter = new discount_route_1.DiscountRouter();
        const balancePointRouter = new point_balance_1.PointBalanceRouter();
        const locationRouter = new location_router_1.LocationRouter();
        const promotionRouter = new promotion_router_1.PromotionRouter();
        const categoryRouter = new category_router_1.CategoryRouter(); // Initialize CategoryRouter
        this.app.get('/api', (req, res) => {
            res.send(`Hello, Purwadhika Student API!`);
        });
        this.app.use('/api/auth', authRouter.getRouter());
        this.app.use('/api/user', profileRouter.getRouter());
        this.app.use('/api/event', eventRouter.getRouter());
        this.app.use('/api/transaction', transactionRouter.getRouter());
        this.app.use('/api/testimonial', testimonialRouter.getRouter());
        this.app.use('/api/discount', discountRouter.getRouter());
        this.app.use('/api/balance-point', balancePointRouter.getRouter());
        this.app.use('/api/promotion', promotionRouter.getRouter());
        this.app.use('/api/category', categoryRouter.getRouter()); // Use CategoryRouter
        this.app.use('/api/location', locationRouter.getRouter()); // Use CategoryRouter
    }
    start() {
        this.app.listen(config_1.PORT, () => {
            console.log(`  ➜  [API] Local: http://localhost:${config_1.PORT}/`);
        });
    }
}
exports.default = App;
