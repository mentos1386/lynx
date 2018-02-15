import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserUserController } from './user.controller';
import { AdminUserController } from './admin.controller';
import { PublicUserController } from './public.controller';
import { UploadMiddleware } from '../../middlewares/upload.middleware';
import { UserService } from './user.service';
import { DatabaseModule } from '../core/database/database.module';
import { OAuthModule } from '../core/oauth/oauth.module';
import { FileModule } from '../file/file.module';
import { EmailModule } from '../core/email/email.module';
import { userProviders } from './user.providers';
import { AuthenticationModule } from '../core/authentication/authentication.module';

@Module({
  modules: [
    DatabaseModule,
    AuthenticationModule,
    OAuthModule,
    FileModule,
    EmailModule,
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
export class UserModule implements NestModule {

  public configure(consumer: MiddlewaresConsumer): void {

    consumer.apply(UploadMiddleware)
    .with({ single: 'file' })
    .forRoutes({ path: '/users/image', method: RequestMethod.POST });
  }
}
