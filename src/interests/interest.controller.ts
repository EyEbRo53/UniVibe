import {
    Controller,
    Get,
    UseGuards,
    Request,
    Body,
    Post,
    Delete,
    Param,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';
import { Interest } from './interest.entity';

@Controller('interest')
export class InterestController {
    constructor(
        private readonly interestService: InterestService,
        private readonly authService: AuthService
    ) { }

    // Only get the InterestIds
    @UseGuards(JwtAuthGuard)
    @Get('/id')
    async getAllInterestIds(@Request() req: any) {
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);
        const interests = await this.interestService.getAllInterestIds(user.user_id);

        return {
            message: "User interests received",
            interests,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllInterest(@Request() req: any) {
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);
        const interests = await this.interestService.getAllInterests(user.user_id);

        return {
            message: "User interests received",
            interests,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createInterest(@Request() req: any, @Body('activity_id') activity_id: number) {
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);
        const activity: Partial<Activity> = { activity_id };
        
        await this.interestService.createInterest(user, activity);

        return {
            message: "Interest has been added",
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteInterest(@Request() req: any, @Param('id') interest_id: number) {
        const user: Partial<User> = await this.authService.identifyUser(req.headers['authorization']);
        const interest: Partial<Interest> = { interest_id };

        await this.interestService.deleteInterest(interest);

        return {
            message: "Interest has been deleted successfully"
        };
    }
}
