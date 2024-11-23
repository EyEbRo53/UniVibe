import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { join } from 'path';
import { GroupMembership } from 'src/groupMember/groupMember.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(GroupMembership)
    private groupMembershipRepository: Repository<GroupMembership>,
  ) {}

  async getAll() {
    const groups = await this.groupRepository.find({
      relations: ['activity', 'owner'], // Load only required relations
    });
    return groups.map(({ memberships, activity, owner, ...group }) => ({
      ...group,
      activity,
      owner: {
        user_id: owner?.user_id,
        user_name: owner?.user_name,
      },
    }));
  }

  async addGroup(group: Partial<Group>): Promise<Group> {
    const result = await this.groupRepository.save(group);
    if (result) {
      return result;
    }
    throw new HttpException(
      'Could not create the group',
      HttpStatus.BAD_REQUEST,
    );
  }

  async deleteGroup(user_id: number, group_id: number): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { group_id },
      relations: ['owner'],
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    if (group.owner.user_id !== user_id) {
      console.log('group owner id: ', group.owner.user_id);
      console.log('user id: ', user_id)
      throw new HttpException(
        'You are not authorized to delete this group',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      await this.groupMembershipRepository.delete({ group: { group_id } });

      await this.groupRepository.delete({ group_id });
    } catch (error) {
      throw new HttpException(
        'An error occurred while deleting the group',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
