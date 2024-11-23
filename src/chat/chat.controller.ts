// chat.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Request() req,
    @Body() body: { receiverId: number; content: string },
  ) {
    const senderId = req.user.user_id;
    const { receiverId, content } = body;
    return this.chatService.saveMessage(senderId, receiverId, content);
  }

  @Post('get-chats')
  @UseGuards(JwtAuthGuard)
  async getChats(@Request() req) {
    const userId = req.user.user_id;
    return this.chatService.getChats(userId);
  }

  @Post('get-messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Request() req, @Body() body: { receiverId: number }) {
    const userId = req.user.user_id;
    const receiverId = body.receiverId;

    return await this.chatService.getMessages(userId, receiverId);
  }

  @Delete('delete-message')
  @UseGuards(JwtAuthGuard)
  async deleteMessage(@Request() req, @Body() body: { message_id: number }) {
    const userId = req.user.user_id;
    const { message_id } = body;

    return this.chatService.deleteMessage(message_id, userId);
  }

  @Delete('delete-chat')
  @UseGuards(JwtAuthGuard)
  async deleteChat(@Request() req, @Body() body: { chat_user_id: number }) {
    const userId = req.user.user_id; // Authenticated user ID
    const { chat_user_id } = body;
  
    return await this.chatService.deleteChat(userId, chat_user_id);
  }
  
}
