import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = (request?.headers?.authorization as string)?.split(' ')[1];
      var response = await this.authService.verifyToken(accessToken);
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}