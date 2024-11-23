import { User } from 'src/users/user.entity';
export declare class Message {
    message_id: number;
    sender: User;
    receiver: User;
    content: string;
    sent_at: Date;
    expires_at: Date;
}
