import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    handleSendMessage(data: {
        senderId: number;
        receiverId: number;
        content: string;
    }, socket: Socket): Promise<void>;
    handleJoinRoom(userId: number, socket: Socket): Promise<void>;
}
