// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    console.log(`User connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.log(`User disconnected: ${socket.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { senderId: number; receiverId: number; content: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { senderId, receiverId, content } = data;

    // Save message to database without passing `sentAt` and `expiresAt`
    const message = await this.chatService.saveMessage(senderId, receiverId, content);

    // Emit the message to the receiver's room
    this.server.to(receiverId.toString()).emit('receive_message', message);
  }

  @SubscribeMessage('join')
  async handleJoinRoom(@MessageBody() userId: number, @ConnectedSocket() socket: Socket) {
    socket.join(userId.toString());
  }
}
