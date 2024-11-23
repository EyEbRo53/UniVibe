import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        access_token?: string;
    }>;
    status(): Promise<{
        message: string;
    }>;
}
