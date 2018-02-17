import { Routes } from 'nest-router';
import { UserModule } from './user/user.module';
import { DemoModule } from './demo/demo.module';

export const appRoutes: Routes = [
  {
    path: '/users',
    module: UserModule,
  },
  {
    path: '/demo',
    module: DemoModule,
  },
];
