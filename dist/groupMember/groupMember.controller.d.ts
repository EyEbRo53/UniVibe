import { AuthService } from 'src/auth/auth.service';
import { GroupMembershipService } from './groupMember.service';
export declare class GroupMembershipController {
    private groupMembershipService;
    private authService;
    constructor(groupMembershipService: GroupMembershipService, authService: AuthService);
    addGroupMember(req: any, group_id: number): Promise<{
        message: string;
    }>;
    removeMember(req: any, groupId: number, userId: number): Promise<{
        message: string;
    }>;
    updateRole(req: any, groupId: number, userId: number, newRole: 'admin' | 'member' | 'owner'): Promise<{
        message: string;
    }>;
    getAllGroupMembers(req: any, group_id: number): Promise<{
        message: string;
        retrievedMembers: any;
    }>;
}
