import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    sendVerification({ email, password }: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    verifyCode({ email, code }: {
        email: string;
        code: string;
    }): Promise<{
        message: string;
    }>;
    registerUser({ email, user_name }: {
        email: string;
        user_name: string;
    }): Promise<{
        message: string;
        user: User;
    }>;
    findAll(): Promise<User[]>;
    updateUser(id: number, updateUserDto: Partial<User>): Promise<Partial<User>>;
    findByUserName(name: string): Promise<Partial<User>[]>;
    findByEmail(email: string): Promise<Partial<User>>;
    findById(id: number): Promise<Partial<User>>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getProfile(id: number): Promise<User>;
}
