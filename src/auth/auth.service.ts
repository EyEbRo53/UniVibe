import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthPayloadDTO } from './dto/auth.dto';
import * as jwt from 'jsonwebtoken';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateToken(user: User): Promise<string> {
    try {
      const payload = { user_id: user.user_id, email: user.email };
      const expiresIn = process.env.JWT_EXPIRATION_TIME || '1h';
      return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: expiresIn,
      });
    } catch (error) {
      throw new BadGatewayException('Token generation failed');
    }
  }

  async identifyUser(authorization: string): Promise<any> {
    try {
      const token = authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return {
        user_id: decodedToken.user_id,
        email: decodedToken.email,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
