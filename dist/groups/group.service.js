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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const group_entity_1 = require("./group.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const groupMember_entity_1 = require("../groupMember/groupMember.entity");
let GroupService = class GroupService {
    constructor(groupRepository, userRepository, groupMembershipRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.groupMembershipRepository = groupMembershipRepository;
    }
    async getAll() {
        const groups = await this.groupRepository.find({
            relations: ['activity', 'owner'],
        });
        return groups.map(({ memberships, activity, owner, ...group }) => ({
            ...group,
            activity,
            owner: {
                user_id: owner?.user_id,
                user_name: owner?.user_name,
            },
        }));
    }
    async addGroup(group) {
        const result = await this.groupRepository.save(group);
        if (result) {
            return result;
        }
        throw new common_1.HttpException('Could not create the group', common_1.HttpStatus.BAD_REQUEST);
    }
    async deleteGroup(user_id, group_id) {
        const group = await this.groupRepository.findOne({
            where: { group_id },
            relations: ['owner'],
        });
        if (!group) {
            throw new common_1.HttpException('Group not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (group.owner.user_id !== user_id) {
            console.log('group owner id: ', group.owner.user_id);
            console.log('user id: ', user_id);
            throw new common_1.HttpException('You are not authorized to delete this group', common_1.HttpStatus.FORBIDDEN);
        }
        try {
            await this.groupMembershipRepository.delete({ group: { group_id } });
            await this.groupRepository.delete({ group_id });
        }
        catch (error) {
            throw new common_1.HttpException('An error occurred while deleting the group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(group_entity_1.Group)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(groupMember_entity_1.GroupMembership)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], GroupService);
//# sourceMappingURL=group.service.js.map