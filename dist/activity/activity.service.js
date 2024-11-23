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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("./activity.entity");
let ActivityService = class ActivityService {
    constructor(activityRepository) {
        this.activityRepository = activityRepository;
    }
    async getAllActivities() {
        return await this.activityRepository.find({});
    }
    async getActivityById(id) {
        return await this.activityRepository.findOne({
            where: { activity_id: id },
        });
    }
    async getActivityByName(name) {
        return await this.activityRepository.findOne({
            where: { type_name: name },
        });
    }
    async createActivity(activity) {
        const result = await this.activityRepository.findOne({
            where: { type_name: activity.type_name },
        });
        if (result) {
            throw new common_1.ConflictException('This activity already exists');
        }
        else {
            await this.activityRepository.save(activity);
        }
    }
    async updateActivity(id) { }
    async deleteActivity(id) { }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityService);
//# sourceMappingURL=activity.service.js.map