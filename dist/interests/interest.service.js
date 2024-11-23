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
exports.InterestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const interest_entity_1 = require("./interest.entity");
const user_entity_1 = require("../users/user.entity");
const activity_entity_1 = require("../activity/activity.entity");
let InterestService = class InterestService {
    constructor(interestRepository, userRepository, activityRepository) {
        this.interestRepository = interestRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }
    async getAllInterestIds(user_id) {
        return await this.interestRepository.find({
            where: {
                user: {
                    user_id
                }
            }
        });
    }
    async getAllInterests(user_id) {
        return await this.interestRepository.find({
            where: {
                user: {
                    user_id
                }
            },
            relations: ['activity']
        });
    }
    async getInterestById(interest_id) {
        await this.interestRepository.findOne({ where: { interest_id } });
    }
    async createInterest(user, activity) {
        const alreadyExists = await this.findInterest(user, activity);
        if (alreadyExists)
            throw new common_1.ConflictException("This Interest already exists for this user");
        const resultUser = await this.findUser(user);
        if (!resultUser)
            throw new common_1.NotFoundException('User is not valid');
        const resultActivity = await this.findActivity(activity);
        if (!resultActivity)
            throw new common_1.NotFoundException('Activity is not valid');
        const interest = {
            user: resultUser,
            activity: resultActivity,
        };
        return await this.interestRepository.save(interest);
    }
    async deleteInterest(interest) {
        const exists = await this.interestRepository.findOne({ where: { interest_id: interest.interest_id } });
        console.log(exists);
        if (!exists)
            throw new common_1.NotFoundException("The Interest you want to delete does not exist");
        return await this.interestRepository.delete(interest);
    }
    async findInterest(user, activity) {
        return await this.interestRepository.findOne({
            where: {
                user,
                activity
            }
        });
    }
    async findUser(user) {
        return await this.userRepository.findOne({
            where: {
                user_id: user.user_id
            }
        });
    }
    async findActivity(activity) {
        return await this.activityRepository.findOne({
            where: {
                activity_id: activity.activity_id
            }
        });
    }
};
exports.InterestService = InterestService;
exports.InterestService = InterestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interest_entity_1.Interest)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InterestService);
//# sourceMappingURL=interest.service.js.map