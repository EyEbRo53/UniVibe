"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestController = void 0;
const common_1 = require("@nestjs/common");
const interest_service_1 = require("./interest.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const auth_service_1 = require("../auth/auth.service");
let InterestController = class InterestController {
    constructor(interestService, authService) {
        this.interestService = interestService;
        this.authService = authService;
    }
    async getAllInterestIds(req) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        const interests = await this.interestService.getAllInterestIds(user.user_id);
        return {
            message: "User interests received",
            interests,
        };
    }
    async getAllInterest(req) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        const interests = await this.interestService.getAllInterests(user.user_id);
        return {
            message: "User interests received",
            interests,
        };
    }
    async createInterest(req, activity_id) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        const activity = { activity_id };
        await this.interestService.createInterest(user, activity);
        return {
            message: "Interest has been added",
        };
    }
    async deleteInterest(req, interest_id) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        const interest = { interest_id };
        await this.interestService.deleteInterest(interest);
        return {
            message: "Interest has been deleted successfully"
        };
    }
};
exports.InterestController = InterestController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/id'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InterestController.prototype, "getAllInterestIds", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InterestController.prototype, "getAllInterest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('activity_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], InterestController.prototype, "createInterest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], InterestController.prototype, "deleteInterest", null);
exports.InterestController = InterestController = __decorate([
    (0, common_1.Controller)('interest'),
    __metadata("design:paramtypes", [interest_service_1.InterestService,
        auth_service_1.AuthService])
], InterestController);
//# sourceMappingURL=interest.controller.js.map