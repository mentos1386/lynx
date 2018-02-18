import { Module } from '@nestjs/common';
import { UserUserController } from './user.controller';
import { AdminUserController } from './admin.controller';
import { PublicUserController } from './public.controller';
import { UserService } from './user.service';
import { OAuthModule } from '../core/oauth/oauth.module';
import { EmailModule } from '../core/email/email.module';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { StorageModule } from '../core/storage/storage.module';
import { CryptoModule } from '../core/crypto/crypto.module';
import { UserRolesGuard } from './guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    AuthenticationModule,
    OAuthModule,
    EmailModule,
    StorageModule,
    CryptoModule,
  ],
  controllers: [
    UserUserController,
    AdminUserController,
    PublicUserController,
  ],
  components: [
    UserService,
    UserRolesGuard,
  ],
  exports: [
    UserService,
    UserRolesGuard,
  ],
})
export class UserModule {
}
