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
exports.GroupMembershipService = void 0;
const common_1 = require("@nestjs/common");
const groupMember_entity_1 = require("./groupMember.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const group_entity_1 = require("../groups/group.entity");
let GroupMembershipService = class GroupMembershipService {
    constructor(groupMembershipRepository, groupRepository) {
        this.groupMembershipRepository = groupMembershipRepository;
        this.groupRepository = groupRepository;
    }
    async addMember(user_id, group_id, role = groupMember_entity_1.GroupRole.MEMBER) {
        if (!Object.values(groupMember_entity_1.GroupRole).includes(role)) {
            throw new common_1.HttpException('Invalid role provided', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const groupExists = await this.groupRepository.findOne({
                where: { group_id },
            });
            if (!groupExists) {
                throw new common_1.HttpException('The specified group does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            const existingMembership = await this.groupMembershipRepository.findOne({
                where: { user: { user_id }, group: { group_id } },
            });
            if (existingMembership) {
                throw new common_1.HttpException('User is already a member of this group', common_1.HttpStatus.BAD_REQUEST);
            }
            const groupMembership = {
                user: { user_id },
                group: { group_id },
                role,
            };
            return await this.groupMembershipRepository.save(groupMembership);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeMember(groupId, userId, requesterId) {
        try {
            const group = await this.groupRepository.findOne({
                where: { group_id: groupId },
                relations: ['owner'],
            });
            if (!group) {
                throw new common_1.HttpException('The specified group does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            if (userId === requesterId) {
                throw new common_1.BadRequestException('You cannot remove yourself from the group');
            }
            const requesterMembership = await this.groupMembershipRepository.findOne({
                where: { group: { group_id: groupId }, user: { user_id: requesterId } },
            });
            const targetMembership = await this.groupMembershipRepository.findOne({
                where: { group: { group_id: groupId }, user: { user_id: userId } },
            });
            if (!requesterMembership) {
                throw new common_1.HttpException('You are not a member of this group', common_1.HttpStatus.FORBIDDEN);
            }
            if (!targetMembership) {
                throw new common_1.HttpException('The target user is not a member of this group', common_1.HttpStatus.NOT_FOUND);
            }
            const roleHierarchy = {
                owner: 3,
                admin: 2,
                member: 1,
            };
            const requesterRoleLevel = roleHierarchy[requesterMembership.role];
            const targetRoleLevel = roleHierarchy[targetMembership.role];
            if (requesterRoleLevel <= targetRoleLevel) {
                throw new common_1.HttpException(`You do not have the necessary permissions to remove a ${targetMembership.role}`, common_1.HttpStatus.FORBIDDEN);
            }
            if (targetMembership.role === 'admin' &&
                requesterMembership.role !== 'owner') {
                throw new common_1.HttpException('Only the group owner can remove an admin', common_1.HttpStatus.FORBIDDEN);
            }
            await this.groupMembershipRepository.delete({
                group: { group_id: groupId },
                user: { user_id: userId },
            });
            return 'Member removed successfully';
        }
        catch (error) {
            throw new common_1.HttpException('Failed to remove member', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRole(groupId, userId, requesterId, newRole) {
        try {
            const group = await this.groupRepository.findOne({
                where: { group_id: groupId },
                relations: ['owner'],
            });
            if (!group) {
                throw new common_1.HttpException('The specified group does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            if (group.owner.user_id !== requesterId) {
                throw new common_1.HttpException('Only the group owner can update roles', common_1.HttpStatus.NOT_FOUND);
            }
            const membership = await this.groupMembershipRepository.findOne({
                where: { group: { group_id: groupId }, user: { user_id: userId } },
            });
            if (!membership) {
                throw new common_1.HttpException('The target user is not a member of this group', common_1.HttpStatus.NOT_FOUND);
            }
            if (newRole === 'owner') {
                if (membership.role === 'owner') {
                    throw new common_1.HttpException('The user is already the group owner', common_1.HttpStatus.BAD_REQUEST);
                }
                membership.role = groupMember_entity_1.GroupRole.OWNER;
                group.owner = { user_id: userId };
                const requesterMembership = await this.groupMembershipRepository.findOne({
                    where: {
                        group: { group_id: groupId },
                        user: { user_id: requesterId },
                    },
                });
                if (requesterMembership) {
                    requesterMembership.role = groupMember_entity_1.GroupRole.ADMIN;
                    await this.groupMembershipRepository.save(requesterMembership);
                }
                await this.groupRepository.save(group);
            }
            else if (newRole === 'admin') {
                if (membership.role === 'admin') {
                    throw new common_1.BadRequestException('The user is already an admin');
                }
                if (membership.role === 'owner') {
                    throw new common_1.BadRequestException('Cannot demote the owner directly to admin');
                }
                membership.role = groupMember_entity_1.GroupRole.ADMIN;
            }
            else if (newRole === 'member') {
                if (membership.role === 'member') {
                    throw new common_1.BadRequestException('The user is already a member');
                }
                membership.role = groupMember_entity_1.GroupRole.MEMBER;
            }
            await this.groupMembershipRepository.save(membership);
            return `User role successfully updated to ${newRole}`;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to update role', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllMembers(group_id) {
        try {
            const groupExists = await this.groupRepository.findOne({
                where: { group_id },
            });
            if (!groupExists) {
                throw new common_1.HttpException('The specified group does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            const groupMemberships = await this.groupMembershipRepository.find({
                where: { group: { group_id } },
                relations: ['user'],
            });
            return groupMemberships.map(({ user, role }) => ({
                user_id: user.user_id,
                user_name: user.user_name,
                role,
            }));
        }
        catch (error) {
            throw new common_1.HttpException('Could not retrieve group members', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GroupMembershipService = GroupMembershipService;
exports.GroupMembershipService = GroupMembershipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(groupMember_entity_1.GroupMembership)),
    __param(1, (0, typeorm_2.InjectRepository)(group_entity_1.Group)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], GroupMembershipService);
//# sourceMappingURL=groupMember.service.js.map