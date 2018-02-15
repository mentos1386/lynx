import { CanActivate, ExecutionContext, Guard } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { EmailNotVerifiedException } from '../modules/user/exceptions/emailNotVerified.exception';
import { BlockedException } from '../modules/user/exceptions/blocked.exception';
import { UnauthorizedException } from '../modules/user/exceptions/unauthorized.exception';

@Guard()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  // noinspection JSUnusedGlobalSymbols
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
      throw new BlockedException();

    if (!user.type || !roles.find(role => role === user.type.toUpperCase())) {
      throw new ForbiddenException('you must be one of ' + roles.join(', '));
    }
    return true;
  }
}
