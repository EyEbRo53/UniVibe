import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';
interface ActivityResponse {
    message: string;
    activity?: Partial<Activity>;
    activities?: Partial<Activity>[];
}
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    getAllActivity(): Promise<ActivityResponse>;
    getActivityBy(id: number): Promise<ActivityResponse>;
    getActivity(name: string): Promise<ActivityResponse>;
    createActivity(name: string): Promise<{
        message: string;
    }>;
}
export {};
