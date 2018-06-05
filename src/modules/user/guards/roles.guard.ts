import {
  CanActivate, ExecutionContext, ForbiddenException, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmailNotVerifiedException } from '../exceptions/emailNotVerified.exception';
import { UserBlockedException } from '../exceptions/userBlocked.exception';
import { Observable } from 'rxjs';

@Injectable()
export class UserRolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      roles = this.reflector.get<string[]>('roles', context.getClass());
      if (!roles) return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user)
      throw new UnauthorizedException();

    // If user is not being impersonated and they do not have verified email
    if (!request.impersonatedById && !request.user.email)
      throw new EmailNotVerifiedException();

    // If user is not being impersonated and they are blocked
    if (!request.impersonatedById && request.user.blocked)
      throw new UserBlockedException();

    if (!user.type || !roles.find(role => role === user.type.toUpperCase())) {
      throw new ForbiddenException();
    }
    return true;
  }
}
