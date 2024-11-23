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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMembership = exports.GroupRole = void 0;
const typeorm_1 = require("typeorm");
const group_entity_1 = require("../groups/group.entity");
const user_entity_1 = require("../users/user.entity");
var GroupRole;
(function (GroupRole) {
    GroupRole["OWNER"] = "owner";
    GroupRole["ADMIN"] = "admin";
    GroupRole["MEMBER"] = "member";
})(GroupRole || (exports.GroupRole = GroupRole = {}));
let GroupMembership = class GroupMembership {
};
exports.GroupMembership = GroupMembership;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], GroupMembership.prototype, "group_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], GroupMembership.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_entity_1.Group, (group) => group.memberships, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", group_entity_1.Group)
], GroupMembership.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.memberships, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], GroupMembership.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'joined_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], GroupMembership.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: GroupRole.MEMBER,
    }),
    __metadata("design:type", String)
], GroupMembership.prototype, "role", void 0);
exports.GroupMembership = GroupMembership = __decorate([
    (0, typeorm_1.Entity)('GroupMembership'),
    (0, typeorm_1.Unique)(['group_id', 'user_id'])
], GroupMembership);
//# sourceMappingURL=groupMember.entity.js.map