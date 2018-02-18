import { ReflectMetadata } from '@nestjs/common';

export const UserRoles = (...roles: string[]) => ReflectMetadata('roles', roles);
