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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const group_service_1 = require("./group.service");
const user_entity_1 = require("../users/user.entity");
const group_entity_1 = require("./group.entity");
const activity_entity_1 = require("../activity/activity.entity");
const groupMember_service_1 = require("../groupMember/groupMember.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const groupMember_entity_1 = require("../groupMember/groupMember.entity");
let GroupController = class GroupController {
    constructor(groupService, authService, groupMembershipService, userRepository, activityRepository, groupRepository) {
        this.groupService = groupService;
        this.authService = authService;
        this.groupMembershipService = groupMembershipService;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.groupRepository = groupRepository;
    }
    async getAll() {
        const groups = await this.groupService.getAll();
        if (groups.length === 0) {
            return {
                message: 'No groups found.',
                groups: [],
            };
        }
        return {
            message: 'Here are the groups',
            groups,
        };
    }
    async createGroup(req, { group_name, description, activity_id, }) {
        const user_id = req.user.user_id;
        if (!group_name || !activity_id || !description) {
            throw new common_1.HttpException('All fields (group_name, description, activity_id) are required', common_1.HttpStatus.BAD_REQUEST);
        }
        const activity = await this.activityRepository.findOne({
            where: { activity_id },
        });
        if (!activity) {
            throw new common_1.HttpException('Activity not found', common_1.HttpStatus.NOT_FOUND);
        }
        const owner = await this.userRepository.findOne({ where: { user_id } });
        if (!owner) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const existingGroup = await this.groupRepository.findOne({
            where: {
                group_name,
                activity: { activity_id },
                owner: { user_id },
            },
            relations: ['activity', 'owner'],
        });
        if (existingGroup) {
            throw new common_1.HttpException('A group with this name already exists for the specified activity and owner', common_1.HttpStatus.CONFLICT);
        }
        const group = {
            group_name,
            description,
            activity,
            owner,
        };
        let createdGroup;
        try {
            createdGroup = await this.groupService.addGroup(group);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!createdGroup || !createdGroup.group_id) {
            throw new common_1.HttpException('Group creation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await this.groupMembershipService.addMember(owner.user_id, createdGroup.group_id, groupMember_entity_1.GroupRole.OWNER);
        return {
            message: 'Group created successfully',
            group: createdGroup,
        };
    }
    async deleteGroup(req, body) {
        const groupId = body.group_id;
        const userId = req.user.user_id;
        await this.groupService.deleteGroup(userId, groupId);
        return { message: 'Group deleted successfully' };
    }
};
exports.GroupController = GroupController;
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('create-group'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Delete)('delete-group'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteGroup", null);
exports.GroupController = GroupController = __decorate([
    (0, common_1.Controller)('groups'),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => groupMember_service_1.GroupMembershipService))),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(5, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __metadata("design:paramtypes", [group_service_1.GroupService,
        auth_service_1.AuthService,
        groupMember_service_1.GroupMembershipService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GroupController);
//# sourceMappingURL=group.controller.js.map