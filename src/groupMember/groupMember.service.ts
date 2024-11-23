import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GroupMembership, GroupRole } from './groupMember.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/groups/group.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class GroupMembershipService {
  constructor(
    @InjectRepository(GroupMembership)
    private groupMembershipRepository: Repository<GroupMembership>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async addMember(
    user_id: number,
    group_id: number,
    role: GroupRole = GroupRole.MEMBER,
  ): Promise<any> {

    if (!Object.values(GroupRole).includes(role)) {
        throw new HttpException(
          'Invalid role provided',
          HttpStatus.BAD_REQUEST,
        );
      }
    try {
      const groupExists = await this.groupRepository.findOne({
        where: { group_id },
      });
      if (!groupExists) {
        throw new HttpException(
          'The specified group does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const existingMembership = await this.groupMembershipRepository.findOne({
        where: { user: { user_id }, group: { group_id } },
      });
      if (existingMembership) {
        throw new HttpException(
          'User is already a member of this group',
          HttpStatus.BAD_REQUEST,
        );
      }

      const groupMembership: Partial<GroupMembership> = {
        user: { user_id } as User,
        group: { group_id } as Group,
        role,
      };

      return await this.groupMembershipRepository.save(groupMembership);
    } catch (error) {
      throw new HttpException(
        //'Could not join the group',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeMember(
    groupId: number,
    userId: number,
    requesterId: number,
  ): Promise<string> {
    try {
      const group = await this.groupRepository.findOne({
        where: { group_id: groupId },
        relations: ['owner'],
      });
      if (!group) {
        throw new HttpException(
          'The specified group does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      if (userId === requesterId) {
        throw new BadRequestException(
          'You cannot remove yourself from the group',
        );
      }

      const requesterMembership = await this.groupMembershipRepository.findOne({
        where: { group: { group_id: groupId }, user: { user_id: requesterId } },
      });
      const targetMembership = await this.groupMembershipRepository.findOne({
        where: { group: { group_id: groupId }, user: { user_id: userId } },
      });

      if (!requesterMembership) {
        throw new HttpException(
          'You are not a member of this group',
          HttpStatus.FORBIDDEN,
        );
      }
      if (!targetMembership) {
        throw new HttpException(
          'The target user is not a member of this group',
          HttpStatus.NOT_FOUND,
        );
      }

      const roleHierarchy: Record<string, number> = {
        owner: 3,
        admin: 2,
        member: 1,
      };

      const requesterRoleLevel = roleHierarchy[requesterMembership.role];
      const targetRoleLevel = roleHierarchy[targetMembership.role];

      if (requesterRoleLevel <= targetRoleLevel) {
        throw new HttpException(
          `You do not have the necessary permissions to remove a ${targetMembership.role}`,
          HttpStatus.FORBIDDEN,
        );
      }

      if (
        targetMembership.role === 'admin' &&
        requesterMembership.role !== 'owner'
      ) {
        throw new HttpException(
          'Only the group owner can remove an admin',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.groupMembershipRepository.delete({
        group: { group_id: groupId },
        user: { user_id: userId },
      });

      return 'Member removed successfully';
    } catch (error) {
      throw new HttpException(
        'Failed to remove member',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRole(
    groupId: number,
    userId: number,
    requesterId: number,
    newRole: 'admin' | 'member' | 'owner',
  ): Promise<string> {
    try {
      const group = await this.groupRepository.findOne({
        where: { group_id: groupId },
        relations: ['owner'],
      });
      if (!group) {
        throw new HttpException(
          'The specified group does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      if (group.owner.user_id !== requesterId) {
        throw new HttpException(
          'Only the group owner can update roles',
          HttpStatus.NOT_FOUND,
        );
      }

      const membership = await this.groupMembershipRepository.findOne({
        where: { group: { group_id: groupId }, user: { user_id: userId } },
      });
      if (!membership) {
        throw new HttpException(
          'The target user is not a member of this group',
          HttpStatus.NOT_FOUND,
        );
      }

      if (newRole === 'owner') {
        // Promote to owner and demote current owner to admin
        if (membership.role === 'owner') {
          throw new HttpException(
            'The user is already the group owner',
            HttpStatus.BAD_REQUEST,
          );
        }

        membership.role = GroupRole.OWNER;
        group.owner = { user_id: userId } as User;

        // Demote the current owner to admin
        const requesterMembership =
          await this.groupMembershipRepository.findOne({
            where: {
              group: { group_id: groupId },
              user: { user_id: requesterId },
            },
          });
        if (requesterMembership) {
          requesterMembership.role = GroupRole.ADMIN;
          await this.groupMembershipRepository.save(requesterMembership);
        }

        await this.groupRepository.save(group);
      } else if (newRole === 'admin') {
        // Promote member to admin
        if (membership.role === 'admin') {
          throw new BadRequestException('The user is already an admin');
        }
        if (membership.role === 'owner') {
          throw new BadRequestException(
            'Cannot demote the owner directly to admin',
          );
        }
        membership.role = GroupRole.ADMIN;
      } else if (newRole === 'member') {
        // Demote admin to member
        if (membership.role === 'member') {
          throw new BadRequestException('The user is already a member');
        }
        membership.role = GroupRole.MEMBER;
      }

      // Save changes
      await this.groupMembershipRepository.save(membership);

      return `User role successfully updated to ${newRole}`;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update role',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMembers(group_id: number): Promise<any> {
    try {
      const groupExists = await this.groupRepository.findOne({
        where: { group_id },
      });
      if (!groupExists) {
        throw new HttpException(
          'The specified group does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const groupMemberships = await this.groupMembershipRepository.find({
        where: { group: { group_id } },
        relations: ['user'],
      });

      return groupMemberships.map(({ user, role }) => ({
        user_id: user.user_id,
        user_name: user.user_name,
        role,
      }));
    } catch (error) {
      throw new HttpException(
        'Could not retrieve group members',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
