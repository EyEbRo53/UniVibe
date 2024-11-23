import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Get,
  Head,
  Header,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GroupService } from './group.service';
import { User } from 'src/users/user.entity';
import { Group } from './group.entity';
import { Activity } from 'src/activity/activity.entity';
import { GroupMembershipService } from 'src/groupMember/groupMember.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupRole } from 'src/groupMember/groupMember.entity';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => GroupMembershipService)) // Using forwardRef to resolve circular dependency
    private readonly groupMembershipService: GroupMembershipService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAll() {
    const groups = await this.groupService.getAll();
    if (groups.length === 0) {
      return {
        message: 'No groups found.',
        groups: [],
      };
    }
    return {
      message: 'Here are the groups',
      groups,
    };
  }

  @Post('create-group')
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @Request() req,
    @Body()
    {
      group_name,
      description,
      activity_id,
    }: { group_name: string; description: string; activity_id: number },
  ) {
    const user_id = req.user.user_id;

    if (!group_name || !activity_id || !description) {
      throw new HttpException(
        'All fields (group_name, description, activity_id) are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const activity = await this.activityRepository.findOne({
      where: { activity_id },
    });
    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    const owner = await this.userRepository.findOne({ where: { user_id } });
    if (!owner) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const existingGroup = await this.groupRepository.findOne({
      where: {
        group_name,
        activity: { activity_id },
        owner: { user_id },
      },
      relations: ['activity', 'owner'],
    });

    if (existingGroup) {
      throw new HttpException(
        'A group with this name already exists for the specified activity and owner',
        HttpStatus.CONFLICT,
      );
    }

    const group: Partial<Group> = {
      group_name,
      description,
      activity,
      owner,
    };

    let createdGroup: Group;
    try {
      createdGroup = await this.groupService.addGroup(group);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!createdGroup || !createdGroup.group_id) {
      throw new HttpException(
        'Group creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Add the owner as a group member with the "owner" role
    await this.groupMembershipService.addMember(
      owner.user_id,
      createdGroup.group_id,
      GroupRole.OWNER,
    );

    return {
      message: 'Group created successfully',
      group: createdGroup,
    };
  }

  @Delete('delete-group')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Request() req, @Body() body: { group_id: number }) {
    const groupId = body.group_id;
    const userId = req.user.user_id;
    await this.groupService.deleteGroup(userId, groupId);
    return { message: 'Group deleted successfully' };
  }
}
