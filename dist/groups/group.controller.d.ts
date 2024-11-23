import { AuthService } from 'src/auth/auth.service';
import { GroupService } from './group.service';
import { User } from 'src/users/user.entity';
import { Group } from './group.entity';
import { Activity } from 'src/activity/activity.entity';
import { GroupMembershipService } from 'src/groupMember/groupMember.service';
import { Repository } from 'typeorm';
export declare class GroupController {
    private readonly groupService;
    private readonly authService;
    private readonly groupMembershipService;
    private readonly userRepository;
    private readonly activityRepository;
    private readonly groupRepository;
    constructor(groupService: GroupService, authService: AuthService, groupMembershipService: GroupMembershipService, userRepository: Repository<User>, activityRepository: Repository<Activity>, groupRepository: Repository<Group>);
    getAll(): Promise<{
        message: string;
        groups: {
            activity: Activity;
            owner: {
                user_id: number;
                user_name: string;
            };
            group_id: number;
            group_name: string;
            description: string | null;
            createdAt: Date;
        }[];
    }>;
    createGroup(req: any, { group_name, description, activity_id, }: {
        group_name: string;
        description: string;
        activity_id: number;
    }): Promise<{
        message: string;
        group: Group;
    }>;
    deleteGroup(req: any, body: {
        group_id: number;
    }): Promise<{
        message: string;
    }>;
}
