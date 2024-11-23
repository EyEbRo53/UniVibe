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
exports.GroupMembershipController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const groupMember_service_1 = require("./groupMember.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let GroupMembershipController = class GroupMembershipController {
    constructor(groupMembershipService, authService) {
        this.groupMembershipService = groupMembershipService;
        this.authService = authService;
    }
    async addGroupMember(req, group_id) {
        const user_id = req.user.user_id;
        if (!group_id) {
            throw new common_1.BadRequestException('Group ID is required');
        }
        await this.groupMembershipService.addMember(user_id, group_id);
        return { message: 'You have successfully joined the requested group' };
    }
    async removeMember(req, groupId, userId) {
        const requesterId = req.user_id;
        if (!groupId || !userId) {
            throw new common_1.HttpException('Missing parameters: group_id and user_id are required', common_1.HttpStatus.BAD_REQUEST);
        }
        const message = await this.groupMembershipService.removeMember(groupId, userId, requesterId);
        return { message };
    }
    async updateRole(req, groupId, userId, newRole) {
        const requesterId = req.user_id;
        if (!groupId || !userId || !newRole) {
            throw new common_1.HttpException('Missing parameters: group_id, user_id, and new_role are required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const message = await this.groupMembershipService.updateRole(groupId, userId, requesterId, newRole);
            return { message };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to update role', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllGroupMembers(req, group_id) {
        const user_id = req.user_id;
        if (!group_id) {
            throw new common_1.BadRequestException('Group ID is required');
        }
        const retrievedMembers = await this.groupMembershipService.getAllMembers(group_id);
        return {
            message: 'Retrieved group members successfully',
            retrievedMembers,
        };
    }
};
exports.GroupMembershipController = GroupMembershipController;
__decorate([
    (0, common_1.Post)('join-group'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('group_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], GroupMembershipController.prototype, "addGroupMember", null);
__decorate([
    (0, common_1.Post)('/remove-member'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('group_id')),
    __param(2, (0, common_1.Body)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], GroupMembershipController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)('/update-role'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('group_id')),
    __param(2, (0, common_1.Body)('user_id')),
    __param(3, (0, common_1.Body)('new_role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], GroupMembershipController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('group_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], GroupMembershipController.prototype, "getAllGroupMembers", null);
exports.GroupMembershipController = GroupMembershipController = __decorate([
    (0, common_1.Controller)('group-memberships'),
    __metadata("design:paramtypes", [groupMember_service_1.GroupMembershipService,
        auth_service_1.AuthService])
], GroupMembershipController);
//# sourceMappingURL=groupMember.controller.js.map