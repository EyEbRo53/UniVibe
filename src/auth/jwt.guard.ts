import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuth = await super.canActivate(context);

    if (isAuth) {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers['authorization'];

      if (!authorization) {
        throw new UnauthorizedException('No token provided');
      }

      try {
        await this.authService.identifyUser(authorization);
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    return false;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
