import { GroupMembership, GroupRole } from './groupMember.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/groups/group.entity';
export declare class GroupMembershipService {
    private groupMembershipRepository;
    private groupRepository;
    constructor(groupMembershipRepository: Repository<GroupMembership>, groupRepository: Repository<Group>);
    addMember(user_id: number, group_id: number, role?: GroupRole): Promise<any>;
    removeMember(groupId: number, userId: number, requesterId: number): Promise<string>;
    updateRole(groupId: number, userId: number, requesterId: number, newRole: 'admin' | 'member' | 'owner'): Promise<string>;
    getAllMembers(group_id: number): Promise<any>;
}
