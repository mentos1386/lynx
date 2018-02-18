import {
  CanActivate, ExecutionContext, ForbiddenException, Guard,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmailNotVerifiedException } from '../exceptions/emailNotVerified.exception';
import { UserBlockedException } from '../exceptions/userBlocked.exception';

@Guard()
export class UserRolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    let roles = this.reflector.get<string[]>('roles', context.handler);
    if (!roles) {
      roles = this.reflector.get<string[]>('roles', context.parent);
      if (!roles) return true;
    }

    const user = req.user;

    if (!user)
      throw new UnauthorizedException();

    // If user is not being impersonated and they do not have verified email
    if (!req.impersonatedById && !req.user.email)
      throw new EmailNotVerifiedException();

    // If user is not being impersonated and they are blocked
    if (!req.impersonatedById && req.user.blocked)
      throw new UserBlockedException();

    if (!user.type || !roles.find(role => role === user.type.toUpperCase())) {
      throw new ForbiddenException();
    }
    return true;
  }
}
