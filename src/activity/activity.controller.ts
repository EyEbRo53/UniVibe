import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';

interface ActivityResponse {
  message: string;
  activity?: Partial<Activity>;
  activities?: Partial<Activity>[];
}

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('/')
  async getAllActivity(): Promise<ActivityResponse> {
    const activities = await this.activityService.getAllActivities();
    return {
      message: "Successfully retrieved all activities",
      activities,
    };
  }

  @Get('/id/:id')
  async getActivityBy(@Param('id') id: number): Promise<ActivityResponse> {
    const activity = await this.activityService.getActivityById(id);
    if (!activity) throw new ConflictException("No activity found");
    return {
      message: "Successfully found the activity",
      activity,
    };
  }

  @Get('/name/:name')
  async getActivity(@Param('name') name: string): Promise<ActivityResponse> {
    const activity = await this.activityService.getActivityByName(name);
    if (!activity) throw new NotFoundException("No activity found");
    return {
      message: "Successfully found the activity",
      activity,
    };
  }

  @Post('/')
  async createActivity(@Body('name') name: string): Promise<{ message: string }> {
    if (!name) throw new BadRequestException("Name parameter is missing");
    const activity: Partial<Activity> = { type_name: name };
    await this.activityService.createActivity(activity);
    return {
      message: "Activity has been created successfully",
    };
  }
}
