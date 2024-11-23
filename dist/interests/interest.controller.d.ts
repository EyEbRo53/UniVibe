import { InterestService } from './interest.service';
import { AuthService } from 'src/auth/auth.service';
import { Interest } from './interest.entity';
export declare class InterestController {
    private readonly interestService;
    private readonly authService;
    constructor(interestService: InterestService, authService: AuthService);
    getAllInterestIds(req: any): Promise<{
        message: string;
        interests: Interest[];
    }>;
    getAllInterest(req: any): Promise<{
        message: string;
        interests: Interest[];
    }>;
    createInterest(req: any, activity_id: number): Promise<{
        message: string;
    }>;
    deleteInterest(req: any, interest_id: number): Promise<{
        message: string;
    }>;
}
