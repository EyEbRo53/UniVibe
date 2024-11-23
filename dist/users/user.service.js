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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const class_validator_1 = require("class-validator");
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
    port: 587,
    secure: false,
});
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.temporaryData = new Map();
    }
    async hashPassword(password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    async sendVerificationCode(email, password) {
        if (!email) {
            throw new common_1.BadRequestException('Email is required.');
        }
        if (!password) {
            throw new common_1.BadRequestException('Password is required.');
        }
        if (!(0, class_validator_1.isEmail)(email)) {
            throw new common_1.BadRequestException('Invalid email format.');
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
        if (!passwordRegex.test(password)) {
            throw new common_1.BadRequestException('Password must be 8-12 characters long and contain at least one letter and one number.');
        }
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists. Please log in instead.');
        }
        const code = crypto.randomBytes(3).toString('hex');
        this.temporaryData.set(email, { code, password, verified: false });
        await this.sendEmail(email, code);
    }
    async verifyCode(email, inputCode) {
        const storedData = this.temporaryData.get(email);
        if (!storedData || storedData.code !== inputCode) {
            throw new common_1.BadRequestException('Invalid Verification Code');
        }
        this.temporaryData.set(email, { ...storedData, verified: true });
        return true;
    }
    async registerUser(user_name, email) {
        const storedData = this.temporaryData.get(email);
        if (!storedData || !storedData.verified) {
            throw new common_1.BadRequestException('Email not verified. Please complete verification first.');
        }
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('An account with this email already exists. Please use a different email.');
        }
        let hashedPassword;
        try {
            hashedPassword = await this.hashPassword(storedData.password);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while processing your registration. Please try again later.');
        }
        let savedUser;
        try {
            const newUser = this.userRepository.create({
                user_name,
                email,
                password_hash: hashedPassword,
            });
            savedUser = await this.userRepository.save(newUser);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while saving your account. Please try again later.');
        }
        try {
            this.temporaryData.delete(email);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while finalizing your registration. Please try again later.');
        }
        return savedUser;
    }
    async sendEmail(email, code) {
        const mailOptions = {
            from: `"Fast Media Support" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: 'Verify Your Email Address',
            text: `Dear User,
  
        Thank you for signing up for Fast Media!
        
        To complete your registration, please use the following verification code:
        
        Verification Code: ${code}
        
        If you did not create this account, you can safely ignore this email.
        
        Best regards,
        The Fast Media Team
        
        For assistance, please contact support at support@fastmedia.com
        `,
            html: `<p>Dear User,</p>
                <p>Thank you for signing up for <strong>Fast Media</strong>!</p>
                <p>To complete your registration, please use the following verification code:</p>
                <h2 style="color: #2e6c80;">${code}</h2>
                <p>If you did not create this account, you can safely ignore this email.</p>
                <p>Best regards,<br>The Fast Media Team</p>
                <p style="font-size: small; color: #888888;">For assistance, please contact support at <a href="mailto:support@fastmedia.com">support@fastmedia.com</a></p>`,
        };
        try {
            await transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.log(error.message);
            console.log("Error stack:", error.stack);
            throw new common_2.HttpException('Failed to send verification email, please try again later', common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        return user;
    }
    findAll() {
        return this.userRepository.find();
    }
    async findByEmail(findEmail) {
        const user = await this.userRepository.findOne({
            where: { email: findEmail },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            user_id: user.user_id,
            email: user.email,
            user_name: user.user_name,
        };
    }
    async findByUserName(name) {
        const users = await this.userRepository.find({
            where: { user_name: name },
        });
        if (!users || users.length === 0) {
            throw new common_1.NotFoundException('No users found with the specified name');
        }
        return users.map((user) => ({
            user_id: user.user_id,
            email: user.email,
            user_name: user.user_name,
        }));
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { user_id: id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            user_id: user.user_id,
            email: user.email,
            user_name: user.user_name,
        };
    }
    async updateUser(id, updateData) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const allowedUpdates = ['user_name', 'profile_image'];
        const updates = Object.keys(updateData).filter((key) => allowedUpdates.includes(key));
        if (updates.length === 0) {
            throw new common_1.BadRequestException('No valid fields to update');
        }
        await this.userRepository.update(id, updateData);
        return this.findById(id);
    }
    async deleteUser(id) {
        try {
            const result = await this.userRepository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error deleting the user');
        }
    }
    async getUserProfile(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['userContacts'],
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            delete user.password_hash;
            delete user.oauth_id;
            delete user.oauth_provider;
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('An error occurred while fetching the user profile. Please try again later.');
            }
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map