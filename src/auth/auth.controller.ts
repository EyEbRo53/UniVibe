import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpException,
  BadRequestException,
  HttpStatus,
  BadGatewayException,
  NotFoundException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service'; // Assuming you have a UsersService to handle user data
import { AuthPayloadDTO } from './dto/auth.dto';
import { NotFoundError } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /*
    Login api calls
  */

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string; access_token?: string }> {
    try {
      const { email, password } = body;

      const user = await this.userService.validateUser(email, password);
      const token = await this.authService.generateToken(user);

      return { message: 'Login successful', access_token: token };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      } else if (error instanceof BadGatewayException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Something went wrong, please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status() {
    return { message: 'JWT is valid and guard is working.' };
  }
}
