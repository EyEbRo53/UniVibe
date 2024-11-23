import { UserContacts } from 'src/userContacts/userContacts.entity';
import { Interest } from '../interests/interest.entity';
import { Post } from 'src/posts/post.entity';
import { Group } from "src/groups/group.entity";
import { GroupMembership } from "src/groupMember/groupMember.entity";
export declare class User {
    user_id: number;
    email: string;
    password_hash: string | null;
    user_name: string;
    profile_pic_url: string | null;
    oauth_provider: string | null;
    oauth_id: string | null;
    created_at: Date;
    userContacts: UserContacts[];
    interests: Interest[];
    posts: Post[];
    owner: Group[];
    memberships: GroupMembership[];
}
