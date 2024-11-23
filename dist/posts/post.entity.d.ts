import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';
import { PostImage } from 'src/postImages/postImage.entity';
export declare class Post {
    post_id: number;
    title: string;
    description: string;
    location: string | null;
    activityType: Activity;
    user: User;
    images: PostImage[];
    created_at: Date;
    expires_at: Date;
}
