import { ReflectMetadata } from '@nestjs/common';

// tslint:disable-next-line:variable-name
export const UserRoles = (...roles: string[]) => ReflectMetadata('roles', roles);
