import { Repository } from 'typeorm';
import { UserContacts } from './userContacts.entity';
import { User } from 'src/users/user.entity';
export declare class UserContactsService {
    private userContactsRepository;
    private userRepository;
    constructor(userContactsRepository: Repository<UserContacts>, userRepository: Repository<User>);
    addContacts(user_id: number, contacts: {
        contact_type: string;
        contact_value: string;
    }[]): Promise<{
        message: string;
    }>;
    getAllContacts(user_id: number): Promise<UserContacts[]>;
    replaceContact(user_id: number, contact_id: any, contact_type: string, contact_value: string): Promise<void>;
    deleteContactById(user_id: number, contact_id: number): Promise<void>;
    clearContactValue(user_id: number, contact_type: string): Promise<{
        message: string;
    }>;
}
