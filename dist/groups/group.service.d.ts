import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { GroupMembership } from 'src/groupMember/groupMember.entity';
export declare class GroupService {
    private groupRepository;
    private userRepository;
    private groupMembershipRepository;
    constructor(groupRepository: Repository<Group>, userRepository: Repository<User>, groupMembershipRepository: Repository<GroupMembership>);
    getAll(): Promise<{
        activity: import("../activity/activity.entity").Activity;
        owner: {
            user_id: number;
            user_name: string;
        };
        group_id: number;
        group_name: string;
        description: string | null;
        createdAt: Date;
    }[]>;
    addGroup(group: Partial<Group>): Promise<Group>;
    deleteGroup(user_id: number, group_id: number): Promise<void>;
}
