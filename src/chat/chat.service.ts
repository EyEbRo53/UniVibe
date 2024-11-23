// chat.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Message } from 'src/chat/message.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveMessage(senderId: number, receiverId: number, content: string) {
    if (!content || content.trim().length === 0) {
      throw new HttpException(
        'Message content cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (senderId === receiverId) {
      throw new HttpException(
        'You cannot send a message to yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sender = await this.userRepository.findOne({
      where: { user_id: senderId },
    });
    if (!sender) {
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
    }

    const receiver = await this.userRepository.findOne({
      where: { user_id: receiverId },
    });
    if (!receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }

    const sentAt = new Date();
    const expiresAt = new Date(sentAt.getTime() + 60 * 60 * 1000);

    try {
      const message = this.messageRepository.create({
        sender,
        receiver,
        content,
        sent_at: sentAt,
        expires_at: expiresAt,
      });

      await this.messageRepository.save(message);

      return { status: 'Message sent successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to send message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChats(userId: number) {
    // Query the Message repository to fetch messages where user is either sender or receiver
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('sender.user_id = :userId OR receiver.user_id = :userId', {
        userId,
      })
      .orderBy('message.sent_at', 'DESC') // Order by most recent messages
      .getMany();

    // To store unique chat users
    const chatUsers = [];

    // Loop through the messages to get the latest message for each user
    for (const message of messages) {
      const otherUser =
        message.sender.user_id !== userId ? message.sender : message.receiver;

      // Check if the user is already in the chat list
      if (!chatUsers.some((user) => user.user_id === otherUser.user_id)) {
        chatUsers.push({
          user_id: otherUser.user_id,
          user_name: otherUser.user_name,
          last_message: message.content,
          last_sent_at: message.sent_at,
        });
      }
    }

    return chatUsers;
  }

  async getMessages(userId: number, receiverId: number) {
    if (userId === receiverId) {
      throw new HttpException(
        'You cannot chat with yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where(
        '(message.sender_id = :userId AND message.receiver_id = :receiverId) OR (message.sender_id = :receiverId AND message.receiver_id = :userId)',
        { userId, receiverId },
      )
      .orderBy('message.sent_at', 'ASC')
      .getMany();

    return messages.map((message) => ({
      messageId: message.message_id,
      senderId: message.sender.user_id,
      content: message.content,
      sentAt: message.sent_at,
    }));
  }

  async deleteMessage(message_id: number, userId: number) {
    const message = await this.messageRepository.findOne({
      where: { message_id },
      relations: ['sender'],
    });

    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }

    if (message.sender.user_id !== userId) {
      throw new HttpException(
        'You can only delete your own messages',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.messageRepository.delete({ message_id });

    return { status: 'Message deleted successfully' };
  }

  async deleteChat(userId: number, chatUserId: number) {
    // Ensure the user is not attempting to delete their own chat
    if (userId === chatUserId) {
      throw new HttpException(
        'You cannot delete a chat with yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Delete messages where the sender or receiver matches `chatUserId` for the current user
    const deleteResult = await this.messageRepository
      .createQueryBuilder()
      .delete()
      .from('Messages') // Explicitly specifying the table
      .where(
        '(sender_id = :userId AND receiver_id = :chatUserId) OR (sender_id = :chatUserId AND receiver_id = :userId)',
        { userId, chatUserId },
      )
      .execute();

    // Return result or status
    if (deleteResult.affected === 0) {
      throw new HttpException(
        'No messages found for this chat',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'Chat deleted successfully',
      deletedMessages: deleteResult.affected,
    };
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteExpiredMessages() {
    await this.messageRepository.delete({ expires_at: LessThan(new Date()) });
  }
}
