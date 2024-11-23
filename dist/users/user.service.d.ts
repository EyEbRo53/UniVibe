import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    private temporaryData;
    constructor(userRepository: Repository<User>);
    hashPassword(password: string): Promise<string>;
    sendVerificationCode(email: string, password: string): Promise<void>;
    verifyCode(email: string, inputCode: string): Promise<boolean>;
    registerUser(user_name: string, email: string): Promise<User>;
    private sendEmail;
    validateUser(email: string, password: string): Promise<User>;
    findAll(): Promise<User[]>;
    findByEmail(findEmail: string): Promise<Partial<User>>;
    findByUserName(name: string): Promise<Partial<User>[]>;
    findById(id: number): Promise<Partial<User>>;
    updateUser(id: number, updateData: Partial<User>): Promise<Partial<User>>;
    deleteUser(id: number): Promise<void>;
    getUserProfile(userId: number): Promise<User>;
}
