import { HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthService } from 'src/auth/auth.service';
export declare class PostController {
    private readonly postService;
    private readonly authService;
    constructor(postService: PostService, authService: AuthService);
    createPost(title: string, description: string, location: string, activityTypeId: number, imageUrls: string[], req: any): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    updatePost(req: any, postId: number, title?: string, description?: string, location?: string, activityTypeId?: number, imageUrls?: string[]): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    deletePost(postId: number, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    getPosts(filters: {
        [key: string]: any;
    }): Promise<import("./post.entity").Post[]>;
    getAllPosts(): Promise<{
        message: string;
        data: {
            user_id: number;
            user_name: string;
            images: import("../postImages/postImage.entity").PostImage[];
            post_id: number;
            title: string;
            description: string;
            location: string | null;
            activityType: import("../activity/activity.entity").Activity;
            created_at: Date;
            expires_at: Date;
        }[];
    }>;
}
