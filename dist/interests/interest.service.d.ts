import { Repository } from 'typeorm';
import { Interest } from './interest.entity';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';
export declare class InterestService {
    private readonly interestRepository;
    private readonly userRepository;
    private readonly activityRepository;
    constructor(interestRepository: Repository<Interest>, userRepository: Repository<User>, activityRepository: Repository<Activity>);
    getAllInterestIds(user_id: number): Promise<Interest[]>;
    getAllInterests(user_id: number): Promise<Interest[]>;
    getInterestById(interest_id: number): Promise<void>;
    createInterest(user: Partial<User>, activity: Partial<Activity>): Promise<any>;
    deleteInterest(interest: Partial<Interest>): Promise<import("typeorm").DeleteResult>;
    findInterest(user: Partial<User>, activity: Partial<Activity>): Promise<Interest>;
    findUser(user: Partial<User>): Promise<User>;
    findActivity(activity: Partial<Activity>): Promise<Activity>;
}
