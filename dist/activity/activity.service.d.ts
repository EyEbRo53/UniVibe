import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
export declare class ActivityService {
    private readonly activityRepository;
    constructor(activityRepository: Repository<Activity>);
    getAllActivities(): Promise<Activity[]>;
    getActivityById(id: number): Promise<Activity>;
    getActivityByName(name: string): Promise<Activity>;
    createActivity(activity: Partial<Activity>): Promise<void>;
    updateActivity(id: number): Promise<void>;
    deleteActivity(id: number): Promise<void>;
}
