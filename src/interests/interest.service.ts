import { ConflictException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegerType, QueryFailedError, Repository } from 'typeorm';
import { Interest } from './interest.entity';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';

@Injectable()
export class InterestService {
    constructor(
        @InjectRepository(Interest)
        private readonly interestRepository: Repository<Interest>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>
    ) { }


    //Get All Interest Ids
    async getAllInterestIds(user_id: number) {
        return await this.interestRepository.find({
            where: {
                user: {
                    user_id
                }
            }
        });
    }
    //Get All Interest Ids, and the Activity Names
    async getAllInterests(user_id: number) {
        return await this.interestRepository.find({
            where:{
                user:{
                    user_id
                }
            },
            relations:['activity']
        });
    }

    // Get a single Interest By Id
    async getInterestById(interest_id: number) {
       await this.interestRepository.findOne({where:{interest_id}});
    }

    //Create a new interest, error handling has been done
    async createInterest(user: Partial<User>, activity: Partial<Activity>) : Promise<any> {

        const alreadyExists: Interest = await this.findInterest(user,activity);
        if(alreadyExists)
            throw new ConflictException("This Interest already exists for this user");

        const resultUser: User = await this.findUser(user);

        if(!resultUser)
            throw new NotFoundException('User is not valid');

        const resultActivity: Activity = await this.findActivity(activity);

        if (!resultActivity)
            throw new NotFoundException('Activity is not valid');

        const interest: Partial<Interest> = {
            user: resultUser,
            activity: resultActivity,
        };

        return await this.interestRepository.save(interest);
    }


     // Delete an interest
     async deleteInterest(interest:Partial<Interest>) {
        const exists : Interest = await this.interestRepository.findOne({where:{interest_id:interest.interest_id}});
        console.log(exists);
        if(!exists)
            throw new NotFoundException("The Interest you want to delete does not exist");

        return await this.interestRepository.delete(interest);
      }



    //Utility Functions to clean Code
    async findInterest(user:Partial<User> , activity: Partial<Activity>) : Promise<Interest>{
        return await this.interestRepository.findOne({
            where:{
                user,
                activity
            }
        });
    }
    async findUser(user:Partial<User>): Promise<User>{
        return await this.userRepository.findOne({
            where: {
                user_id:user.user_id
            }
        });
    }
    async findActivity(activity:Partial<Activity>):Promise<Activity>{
        return await this.activityRepository.findOne({
            where: {
                activity_id:activity.activity_id
            }
        });
    }
   
}
