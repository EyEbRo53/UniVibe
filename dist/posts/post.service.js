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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./post.entity");
const postImage_entity_1 = require("../postImages/postImage.entity");
const geolib_1 = require("geolib");
const dotenv = require("dotenv");
const activity_entity_1 = require("../activity/activity.entity");
dotenv.config();
let PostService = class PostService {
    constructor(postRepository, activityRepository, postImageRepository) {
        this.postRepository = postRepository;
        this.activityRepository = activityRepository;
        this.postImageRepository = postImageRepository;
    }
    check_post_input(title, description, location) {
        if (!title?.trim())
            throw new common_1.BadRequestException('Title is required and cannot be empty.');
        if (!description?.trim())
            throw new common_1.BadRequestException('Description is required and cannot be empty.');
        if (!location?.trim())
            throw new common_1.BadRequestException('Location is required and cannot be empty.');
    }
    async createPost(userId, title, description, location, activityTypeId, imageUrls = []) {
        this.check_post_input(title, description, location);
        const activityType = await this.activityRepository.findOne({
            where: { activity_id: activityTypeId },
        });
        if (!activityType)
            throw new common_1.NotFoundException('Activity type not found.');
        const expiresAt = new Date();
        let expireTimeHours = parseInt(process.env.EXPIRE_TIME, 10);
        if (isNaN(expireTimeHours) || expireTimeHours <= 0) {
            console.error(`Invalid expiration time: ${process.env.EXPIRE_TIME}`);
            expireTimeHours = 24;
        }
        expiresAt.setHours(expiresAt.getHours() + expireTimeHours);
        const post = this.postRepository.create({
            user: { user_id: userId },
            title,
            description,
            location,
            activityType,
            expires_at: expiresAt,
        });
        const savedPost = await this.postRepository.save(post);
        if (imageUrls.length > 0) {
            const postImages = imageUrls.map((url) => this.postImageRepository.create({
                post: savedPost,
                image_url: url,
            }));
            await this.postImageRepository.save(postImages);
            savedPost.images = postImages;
        }
    }
    async updatePost(userId, postId, title, description, location, activityTypeId, imageUrls) {
        const post = await this.postRepository.findOne({
            where: { post_id: postId, user: { user_id: userId } },
            relations: ['images'],
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found or not authorized');
        }
        if (title || description || location) {
            this.check_post_input(title || post.title, description || post.description, location || post.location);
        }
        if (title)
            post.title = title;
        if (description)
            post.description = description;
        if (location)
            post.location = location;
        if (activityTypeId !== undefined) {
            const activityType = await this.activityRepository.findOne({
                where: { activity_id: activityTypeId },
            });
            if (!activityType) {
                throw new common_1.NotFoundException('Activity type not found');
            }
            post.activityType = activityType;
        }
        if (imageUrls !== undefined && Array.isArray(imageUrls)) {
            if (imageUrls.length > 0) {
                await this.postImageRepository.delete({ post: { post_id: postId } });
                const postImages = imageUrls.map((url) => this.postImageRepository.create({
                    post,
                    image_url: url,
                }));
                await this.postImageRepository.save(postImages);
                post.images = postImages;
            }
        }
        await this.postRepository.save(post);
    }
    async deletePost(userId, postId) {
        const post = await this.postRepository.findOne({
            where: { post_id: postId, user: { user_id: userId } },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found or not authorized');
        }
        await this.postRepository.remove(post);
    }
    async getPosts(filters) {
        const { radius = '1km', 'activity type': activityType, location } = filters;
        if (!location) {
            throw new Error('Location is required to filter by radius');
        }
        const [userLatitude, userLongitude] = location
            .split(',')
            .map((coord) => parseFloat(coord.trim()));
        const searchRadius = parseFloat(radius) * 1000 || 1000;
        const query = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.activityType', 'activity');
        if (activityType) {
            query.andWhere('activity.type_name = :activityType', { activityType });
        }
        const posts = await query.getMany();
        const filteredPosts = posts.filter((post) => {
            if (!post.location)
                return false;
            const [postLatitude, postLongitude] = post.location
                .split(',')
                .map((coord) => parseFloat(coord.trim()));
            const distance = (0, geolib_1.getDistance)({ latitude: userLatitude, longitude: userLongitude }, { latitude: postLatitude, longitude: postLongitude });
            return distance <= searchRadius;
        });
        return filteredPosts;
    }
    async getAllPosts() {
        try {
            const joinedData = await this.postRepository.find({ relations: ["images", "user"] });
            const postForHomePage = joinedData.map((post) => {
                const { user, images, ...postDetails } = post;
                return {
                    ...postDetails,
                    user_id: user.user_id,
                    user_name: user.user_name,
                    images,
                };
            });
            return postForHomePage;
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Error while retrieving posts');
        }
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(2, (0, typeorm_1.InjectRepository)(postImage_entity_1.PostImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PostService);
//# sourceMappingURL=post.service.js.map