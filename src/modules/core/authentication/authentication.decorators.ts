import { createParamDecorator } from '@nestjs/common';
import { User as UserEntity } from '../../user/user.entity';
import { IAuthenticatedRequest } from './authentication.interface';

// tslint:disable-next-line:variable-name
export const AuthenticatedUser = createParamDecorator(
  (data: any, req: IAuthenticatedRequest): UserEntity => {
    return req.user;
  },
);

// tslint:disable-next-line:variable-name
export const ImpersonatedById = createParamDecorator(
  (data: any, req: IAuthenticatedRequest): number => {
    return req.impersonatedById;
  },
);

// tslint:disable-next-line:variable-name
export const AuthorizationToken = createParamDecorator(
  (data: any, req: IAuthenticatedRequest): string => {
    return req.headers['authorization'];
  },
);
