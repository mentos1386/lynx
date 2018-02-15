import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { LoggerModule } from './core/logger/logger.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { RouterModule } from 'nest-router';
import { appRoutes } from './app.routes';

@Module({
  modules: [
    LoggerModule, // Global
    AuthenticationModule, // Required for AuthMiddleware

    RouterModule.forRoutes(appRoutes),

    UserModule,
  ],
})
export class ApplicationModule implements NestModule {

  public configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(AuthMiddleware)
    .forRoutes({ path: '*' });
  }
}
