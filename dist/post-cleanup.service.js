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
var PostCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./posts/post.entity");
const typeorm_2 = require("@nestjs/typeorm");
let PostCleanupService = PostCleanupService_1 = class PostCleanupService {
    constructor(postRepository) {
        this.postRepository = postRepository;
        this.logger = new common_1.Logger(PostCleanupService_1.name);
    }
    async deleteExpiredPosts() {
        try {
            const now = new Date();
            const deleteResult = await this.postRepository.delete({
                expires_at: (0, typeorm_1.LessThan)(now),
            });
            this.logger.log(`Deleted ${deleteResult.affected} expired posts at ${now.toISOString()}`);
        }
        catch (error) {
            this.logger.error('Error deleting expired posts', error.stack);
        }
    }
};
exports.PostCleanupService = PostCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostCleanupService.prototype, "deleteExpiredPosts", null);
exports.PostCleanupService = PostCleanupService = PostCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PostCleanupService);
//# sourceMappingURL=post-cleanup.service.js.map