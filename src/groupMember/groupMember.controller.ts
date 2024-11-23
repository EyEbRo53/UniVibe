import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';
import { GroupMembershipService } from './groupMember.service';
import { Group } from 'src/groups/group.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('group-memberships')
export class GroupMembershipController {
  constructor(
    private groupMembershipService: GroupMembershipService,
    private authService: AuthService,
  ) {}

  @Post('join-group')
  @UseGuards(JwtAuthGuard)
  async addGroupMember(@Request() req, @Body('group_id') group_id: number) {
    const user_id = req.user.user_id;

    if (!group_id) {
      throw new BadRequestException('Group ID is required');
    }

    await this.groupMembershipService.addMember(user_id, group_id);
    return { message: 'You have successfully joined the requested group' };
  }

  @Post('/remove-member')
  @UseGuards(JwtAuthGuard)
  async removeMember(
    @Request() req,
    @Body('group_id') groupId: number,
    @Body('user_id') userId: number,
  ) {
    const requesterId = req.user_id;

    if (!groupId || !userId) {
      throw new HttpException(
        'Missing parameters: group_id and user_id are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const message = await this.groupMembershipService.removeMember(
      groupId,
      userId,
      requesterId,
    );
    return { message };
  }

  @Post('/update-role')
  @UseGuards(JwtAuthGuard)
  async updateRole(
    @Request() req,
    @Body('group_id') groupId: number,
    @Body('user_id') userId: number,
    @Body('new_role') newRole: 'admin' | 'member' | 'owner',
  ) {
    const requesterId = req.user_id;

    if (!groupId || !userId || !newRole) {
      throw new HttpException(
        'Missing parameters: group_id, user_id, and new_role are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const message = await this.groupMembershipService.updateRole(
        groupId,
        userId,
        requesterId,
        newRole,
      );
      return { message };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update role',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAllGroupMembers(@Request() req, @Body('group_id') group_id: number) {
    const user_id = req.user_id;

    if (!group_id) {
      throw new BadRequestException('Group ID is required');
    }

    const retrievedMembers =
      await this.groupMembershipService.getAllMembers(group_id);
    return {
      message: 'Retrieved group members successfully',
      retrievedMembers,
    };
  }
}
