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
exports.UserContactController = void 0;
const common_1 = require("@nestjs/common");
const userContacts_service_1 = require("./userContacts.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const auth_service_1 = require("../auth/auth.service");
let UserContactController = class UserContactController {
    constructor(contactsService, authService) {
        this.contactsService = contactsService;
        this.authService = authService;
    }
    async getContacts(req) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        const contacts = await this.contactsService.getAllContacts(user.user_id);
        return {
            message: "Retrieved User Contacts",
            contacts
        };
    }
    async addContacts(req, contacts) {
        console.log(req.headers['authorization']);
        const user = await this.authService.identifyUser(req.headers['authorization']);
        if (!Array.isArray(contacts) || contacts.length === 0) {
            throw new common_1.BadRequestException("Invalid or empty contacts list");
        }
        for (const contact of contacts) {
            const { contact_type, contact_value } = contact;
            if (!contact_type || !contact_value) {
                throw new common_1.BadRequestException("Each contact must have a type and value");
            }
        }
        await this.contactsService.addContacts(user.user_id, contacts);
        return {
            message: "Contacts added successfully"
        };
    }
    async replaceContact(req, contact_id, contact_type, contact_value) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        if (!contact_type || !contact_value || !contact_id)
            throw new common_1.BadRequestException("Parameters are invalid");
        const result = await this.contactsService.replaceContact(user.user_id, contact_id, contact_type, contact_value);
        return {
            message: "Contact updated Successfully"
        };
    }
    async deleteContact(req, contact_id) {
        const user = await this.authService.identifyUser(req.headers['authorization']);
        if (!contact_id)
            throw new common_1.BadRequestException("Contact Id is missing");
        const result = await this.contactsService.deleteContactById(user.user_id, contact_id);
        return {
            message: "Contact deleted Successfully"
        };
    }
};
exports.UserContactController = UserContactController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserContactController.prototype, "getContacts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('contacts')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UserContactController.prototype, "addContacts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('contact_id')),
    __param(2, (0, common_1.Body)('contact_type')),
    __param(3, (0, common_1.Body)('contact_value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String]),
    __metadata("design:returntype", Promise)
], UserContactController.prototype, "replaceContact", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('contact_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserContactController.prototype, "deleteContact", null);
exports.UserContactController = UserContactController = __decorate([
    (0, common_1.Controller)('contacts'),
    __metadata("design:paramtypes", [userContacts_service_1.UserContactsService,
        auth_service_1.AuthService])
], UserContactController);
//# sourceMappingURL=userContacts.controller.js.map