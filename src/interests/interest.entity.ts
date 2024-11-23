import { Entity, ManyToOne, Unique, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Activity } from "../activity/activity.entity";

@Entity()
@Unique(["user", "activity"]) 
export class Interest {
    @PrimaryGeneratedColumn() 
    interest_id: number;

    @ManyToOne(() => User, (user) => user.interests, ) 
    user: User;
    
    @ManyToOne(() => Activity, (activity) => activity.interests) 
    activity: Activity;
}
