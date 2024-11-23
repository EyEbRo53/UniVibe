import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /*
    Sign up api calls
  */

  @Post('send-verification')
  async sendVerification(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<{ message: string }> {
    await this.userService.sendVerificationCode(email, password);
    return { message: 'Verification code sent to email' };
  }

  @Post('verify-code')
  async verifyCode(
    @Body() { email, code }: { email: string; code: string },
  ): Promise<{ message: string }> {
    await this.userService.verifyCode(email, code);
    return { message: 'Code verified. Proceed to send your username.' };
  }

  @Post('register')
  async registerUser(
    @Body() { email, user_name }: { email: string; user_name: string },
  ): Promise<{ message: string; user: User }> {
      const user = await this.userService.registerUser(user_name, email);
      return { message: 'User registered successfully', user };
  }

  // GET /users - Fetch all users
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /*
    User CRUD
  */

  //TODO: this is yet to be completed
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ): Promise<Partial<User>> {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('name/:name')
  async findByUserName(@Param('name') name: string): Promise<Partial<User>[]> {
    try {
      return await this.userService.findByUserName(name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Partial<User>> {
    try {
      return await this.userService.findByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('id/:id')
  async findById(@Param('id') id: number): Promise<Partial<User>> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.userService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof InternalServerErrorException) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'User could not be deleted, try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
    User Profile
  */

  @Get(':id/profile')
  async getProfile(@Param('id') id: number): Promise<User> {
    try {
      return await this.userService.getUserProfile(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
