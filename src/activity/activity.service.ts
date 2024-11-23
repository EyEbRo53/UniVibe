import { ConflictException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegerType, QueryFailedError, Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  //Get Function
  async getAllActivities() {
    return await this.activityRepository.find({});
  }

  // Method to get a single activity by ID
  async getActivityById(id: number) {
    return await this.activityRepository.findOne({
      where: { activity_id: id },
    });
  }

  async getActivityByName(name: string) {
    return await this.activityRepository.findOne({
      where: { type_name: name },
    });
  }

  // Method to create a new activity
  async createActivity(activity: Partial<Activity>) {
    const result = await this.activityRepository.findOne({
      where: { type_name: activity.type_name },
    });
    if (result) {
      throw new ConflictException('This activity already exists');
    } else {
      await this.activityRepository.save(activity);
    }
  }
  // Method to get all activities

  // Method to update an existing activity
  async updateActivity(id: number) {}

  // Method to delete an activity
  async deleteActivity(id: number) {}
}
