import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, body: {
        receiverId: number;
        content: string;
    }): Promise<{
        status: string;
    }>;
    getChats(req: any): Promise<any[]>;
    getMessages(req: any, body: {
        receiverId: number;
    }): Promise<{
        messageId: number;
        senderId: number;
        content: string;
        sentAt: Date;
    }[]>;
    deleteMessage(req: any, body: {
        message_id: number;
    }): Promise<{
        status: string;
    }>;
    deleteChat(req: any, body: {
        chat_user_id: number;
    }): Promise<{
        status: string;
        deletedMessages: number;
    }>;
}
