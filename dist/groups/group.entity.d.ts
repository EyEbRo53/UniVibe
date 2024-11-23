import { User } from 'src/users/user.entity';
import { Activity } from '../activity/activity.entity';
import { GroupMembership } from "src/groupMember/groupMember.entity";
export declare class Group {
    group_id: number;
    group_name: string;
    description: string | null;
    activity: Activity;
    createdAt: Date;
    owner: User;
    memberships: GroupMembership[];
}
