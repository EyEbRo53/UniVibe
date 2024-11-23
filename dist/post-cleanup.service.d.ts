import { Repository } from 'typeorm';
import { Post } from './posts/post.entity';
export declare class PostCleanupService {
    private readonly postRepository;
    private readonly logger;
    constructor(postRepository: Repository<Post>);
    deleteExpiredPosts(): Promise<void>;
}
