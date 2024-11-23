import { Group } from '../groups/group.entity';
import { User } from '../users/user.entity';
export declare enum GroupRole {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class GroupMembership {
    group_id: number;
    user_id: number;
    group: Group;
    user: User;
    joined_at: Date;
    role: GroupRole;
}
