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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const auth_service_1 = require("../auth/auth.service");
let PostController = class PostController {
    constructor(postService, authService) {
        this.postService = postService;
        this.authService = authService;
    }
    async createPost(title, description, location, activityTypeId, imageUrls, req) {
        try {
            const user = await this.authService.identifyUser(req.headers['authorization']);
            this.postService.createPost(user.user_id, title, description, location, activityTypeId, imageUrls);
            return {
                status: common_1.HttpStatus.OK,
                message: 'post created successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else if (error instanceof common_1.NotAcceptableException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            else if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                console.error('Unexpected error while creating post:', error);
                throw new common_1.HttpException('An error occurred while creating the post', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updatePost(req, postId, title, description, location, activityTypeId, imageUrls) {
        try {
            const user = await this.authService.identifyUser(req.headers['authorization']);
            await this.postService.updatePost(user.user_id, postId, title, description, location, activityTypeId, imageUrls || []);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Post updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else if (error instanceof common_1.NotAcceptableException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            else if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                throw new common_1.HttpException('an error occurred while updating the post', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deletePost(postId, req) {
        try {
            const user = await this.authService.identifyUser(req.headers['authorization']);
            await this.postService.deletePost(user.user_id, postId);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Post deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('An error occurred while deleting the post', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getPosts(filters) {
        try {
            return this.postService.getPosts(filters);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPosts() {
        try {
            const posts = await this.postService.getAllPosts();
            return {
                message: 'Posts retrieved successfully',
                data: posts,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('description')),
    __param(2, (0, common_1.Body)('location')),
    __param(3, (0, common_1.Body)('activityTypeId')),
    __param(4, (0, common_1.Body)('imageUrls')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Array, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, common_1.Put)(':postId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __param(4, (0, common_1.Body)('location')),
    __param(5, (0, common_1.Body)('activityTypeId')),
    __param(6, (0, common_1.Body)('imageUrls')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, String, Number, Array]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':postId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAllPosts", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService,
        auth_service_1.AuthService])
], PostController);
//# sourceMappingURL=post.controller.js.map