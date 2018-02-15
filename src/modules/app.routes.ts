
import { Routes } from 'nest-router';
import { UserModule } from './user/user.module';

export const appRoutes: Routes = [
  {
    path: '/users',
    module: UserModule,
  },
];
