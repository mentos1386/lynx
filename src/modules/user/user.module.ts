import { MiddlewaresConsumer, Module } from '@nestjs/common';
import { UserUserController } from './user.controller';
import { AdminUserController } from './admin.controller';
import { PublicUserController } from './public.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../core/database/database.module';
import { OAuthModule } from '../core/oauth/oauth.module';
import { EmailModule } from '../core/email/email.module';
import { userProviders } from './user.providers';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { StorageModule } from '../core/storage/storage.module';

@Module({
  modules: [
    DatabaseModule,
    AuthenticationModule,
    OAuthModule,
    EmailModule,
    StorageModule,
  ],
  controllers: [
    UserUserController,
    AdminUserController,
    PublicUserController,
  ],
  components: [
    ...userProviders,
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {
}
