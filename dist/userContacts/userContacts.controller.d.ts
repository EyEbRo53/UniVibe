import { UserContacts } from './userContacts.entity';
import { UserContactsService } from './userContacts.service';
import { AuthService } from 'src/auth/auth.service';
export declare class UserContactController {
    private readonly contactsService;
    private readonly authService;
    constructor(contactsService: UserContactsService, authService: AuthService);
    getContacts(req: Request): Promise<{
        message: string;
        contacts: UserContacts[];
    }>;
    addContacts(req: Request, contacts: {
        contact_type: string;
        contact_value: string;
    }[]): Promise<{
        message: string;
    }>;
    replaceContact(req: Request, contact_id: number, contact_type: string, contact_value: string): Promise<{
        message: string;
    }>;
    deleteContact(req: Request, contact_id: number): Promise<{
        message: string;
    }>;
}
