import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  BadGatewayException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // Your email from environment variables
    pass: process.env.SMTP_PASSWORD, // Your app password from environment variables
  },
  port: 587,
  secure: false, // Set to false because 587 uses STARTTLS
  // tls: {
  //   rejectUnauthorized: false, // Allows self-signed certificates (not recommended for production)
  // },
});

//TODO: throw exceptions and catch them in controller
@Injectable()
export class UserService {
  private temporaryData: Map<
    string,
    { code: string; password: string; verified: boolean }
  > = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  /*
    Sign up api calls
  */

  async sendVerificationCode(email: string, password: string): Promise<void> {
    if (!email) {
      throw new BadRequestException('Email is required.');
    }

    if (!password) {
      throw new BadRequestException('Password is required.');
    }

    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'Password must be 8-12 characters long and contain at least one letter and one number.',
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email already exists. Please log in instead.',
      );
    }

    const code = crypto.randomBytes(3).toString('hex');

    this.temporaryData.set(email, { code, password, verified: false });
    await this.sendEmail(email, code);
  }

  async verifyCode(email: string, inputCode: string): Promise<boolean> {
    const storedData = this.temporaryData.get(email);

    if (!storedData || storedData.code !== inputCode) {
      throw new BadRequestException('Invalid Verification Code');
    }

    this.temporaryData.set(email, { ...storedData, verified: true });
    return true;
  }

  async registerUser(user_name: string, email: string): Promise<User> {
    const storedData = this.temporaryData.get(email);
  
    if (!storedData || !storedData.verified) {
      throw new BadRequestException(
        'Email not verified. Please complete verification first.',
      );
    }
  
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists. Please use a different email.',
      );
    }
  
    let hashedPassword: string;
    try {
      hashedPassword = await this.hashPassword(storedData.password);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while processing your registration. Please try again later.',
      );
    }

    let savedUser: User;
    try {
      const newUser = this.userRepository.create({
        user_name,
        email,
        password_hash: hashedPassword,
      });
      savedUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while saving your account. Please try again later.',
      );
    }

    try {
      this.temporaryData.delete(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while finalizing your registration. Please try again later.',
      );
    }

    return savedUser;
  }
  

  private async sendEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Fast Media Support" <${process.env.SMTP_EMAIL}>`, // Include a sender name
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
    } catch (error) {
      console.log(error.message);
      console.log("Error stack:", error.stack);
      throw new HttpException(
        'Failed to send verification email, please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
    Login api calls
  */

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  /*
    User API calls
  */

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(findEmail: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { email: findEmail },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
    };
  }

  async findByUserName(name: string): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      where: { user_name: name },
    });
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found with the specified name');
    }

    return users.map((user) => ({
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
    }));
  }

  async findById(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
    };
  }

  async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<Partial<User>> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allowedUpdates = ['user_name', 'profile_image'];
    const updates = Object.keys(updateData).filter((key) =>
      allowedUpdates.includes(key),
    );

    if (updates.length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    await this.userRepository.update(id, updateData);

    return this.findById(id);
  }

  // Delete user by ID
  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting the user');
    }
  }

  /*
    User Profile
  */

  async getUserProfile(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
        relations: ['userContacts'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      delete user.password_hash;
      delete user.oauth_id;
      delete user.oauth_provider;

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while fetching the user profile. Please try again later.',
        );
      }
    }
  }
}
