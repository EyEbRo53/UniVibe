import { Repository } from 'typeorm';
import { Message } from 'src/chat/message.entity';
import { User } from 'src/users/user.entity';
export declare class ChatService {
    private messageRepository;
    private userRepository;
    constructor(messageRepository: Repository<Message>, userRepository: Repository<User>);
    saveMessage(senderId: number, receiverId: number, content: string): Promise<{
        status: string;
    }>;
    getChats(userId: number): Promise<any[]>;
    getMessages(userId: number, receiverId: number): Promise<{
        messageId: number;
        senderId: number;
        content: string;
        sentAt: Date;
    }[]>;
    deleteMessage(message_id: number, userId: number): Promise<{
        status: string;
    }>;
    deleteChat(userId: number, chatUserId: number): Promise<{
        status: string;
        deletedMessages: number;
    }>;
    deleteExpiredMessages(): Promise<void>;
}
