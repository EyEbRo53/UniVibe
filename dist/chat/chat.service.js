"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./message.entity");
const user_entity_1 = require("../users/user.entity");
let ChatService = class ChatService {
    constructor(messageRepository, userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    async saveMessage(senderId, receiverId, content) {
        if (!content || content.trim().length === 0) {
            throw new common_1.HttpException('Message content cannot be empty', common_1.HttpStatus.BAD_REQUEST);
        }
        if (senderId === receiverId) {
            throw new common_1.HttpException('You cannot send a message to yourself', common_1.HttpStatus.BAD_REQUEST);
        }
        const sender = await this.userRepository.findOne({
            where: { user_id: senderId },
        });
        if (!sender) {
            throw new common_1.HttpException('Sender not found', common_1.HttpStatus.NOT_FOUND);
        }
        const receiver = await this.userRepository.findOne({
            where: { user_id: receiverId },
        });
        if (!receiver) {
            throw new common_1.HttpException('Receiver not found', common_1.HttpStatus.NOT_FOUND);
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
        }
        catch (error) {
            throw new common_1.HttpException('Failed to send message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChats(userId) {
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('sender.user_id = :userId OR receiver.user_id = :userId', {
            userId,
        })
            .orderBy('message.sent_at', 'DESC')
            .getMany();
        const chatUsers = [];
        for (const message of messages) {
            const otherUser = message.sender.user_id !== userId ? message.sender : message.receiver;
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
    async getMessages(userId, receiverId) {
        if (userId === receiverId) {
            throw new common_1.HttpException('You cannot chat with yourself', common_1.HttpStatus.BAD_REQUEST);
        }
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('(message.sender_id = :userId AND message.receiver_id = :receiverId) OR (message.sender_id = :receiverId AND message.receiver_id = :userId)', { userId, receiverId })
            .orderBy('message.sent_at', 'ASC')
            .getMany();
        return messages.map((message) => ({
            messageId: message.message_id,
            senderId: message.sender.user_id,
            content: message.content,
            sentAt: message.sent_at,
        }));
    }
    async deleteMessage(message_id, userId) {
        const message = await this.messageRepository.findOne({
            where: { message_id },
            relations: ['sender'],
        });
        if (!message) {
            throw new common_1.HttpException('Message not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (message.sender.user_id !== userId) {
            throw new common_1.HttpException('You can only delete your own messages', common_1.HttpStatus.FORBIDDEN);
        }
        await this.messageRepository.delete({ message_id });
        return { status: 'Message deleted successfully' };
    }
    async deleteChat(userId, chatUserId) {
        if (userId === chatUserId) {
            throw new common_1.HttpException('You cannot delete a chat with yourself', common_1.HttpStatus.BAD_REQUEST);
        }
        const deleteResult = await this.messageRepository
            .createQueryBuilder()
            .delete()
            .from('Messages')
            .where('(sender_id = :userId AND receiver_id = :chatUserId) OR (sender_id = :chatUserId AND receiver_id = :userId)', { userId, chatUserId })
            .execute();
        if (deleteResult.affected === 0) {
            throw new common_1.HttpException('No messages found for this chat', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            status: 'Chat deleted successfully',
            deletedMessages: deleteResult.affected,
        };
    }
    async deleteExpiredMessages() {
        await this.messageRepository.delete({ expires_at: (0, typeorm_2.LessThan)(new Date()) });
    }
};
exports.ChatService = ChatService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatService.prototype, "deleteExpiredMessages", null);
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map