import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostImage } from 'src/postImages/postImage.entity';
import { Activity } from 'src/activity/activity.entity';
export declare class PostService {
    private readonly postRepository;
    private readonly activityRepository;
    private readonly postImageRepository;
    constructor(postRepository: Repository<Post>, activityRepository: Repository<Activity>, postImageRepository: Repository<PostImage>);
    private check_post_input;
    createPost(userId: number, title: string, description: string, location: string, activityTypeId: number, imageUrls?: string[]): Promise<void>;
    updatePost(userId: number, postId: number, title?: string, description?: string, location?: string, activityTypeId?: number, imageUrls?: string[]): Promise<void>;
    deletePost(userId: number, postId: number): Promise<void>;
    getPosts(filters: {
        [key: string]: any;
    }): Promise<Post[]>;
    getAllPosts(): Promise<{
        user_id: number;
        user_name: string;
        images: PostImage[];
        post_id: number;
        title: string;
        description: string;
        location: string | null;
        activityType: Activity;
        created_at: Date;
        expires_at: Date;
    }[]>;
}
