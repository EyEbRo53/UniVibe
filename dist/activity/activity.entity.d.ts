import { Interest } from '../interests/interest.entity';
import { Post } from 'src/posts/post.entity';
import { Group } from "src/groups/group.entity";
export declare class Activity {
    activity_id: number;
    type_name: string;
    interests: Interest[];
    posts: Post[];
    groups: Group[];
}
