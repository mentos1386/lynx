import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { LoggerModule } from './core/logger/logger.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { RouterModule } from 'nest-router';
import { appRoutes } from './app.routes';
import { DemoModule } from './demo/demo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RavenModule } from 'nest-raven';

@Module({
  imports: [
    LoggerModule, // Global
    AuthenticationModule, // Required for AuthMiddleware

    // Init TypeOrm
    TypeOrmModule.forRoot(),
    // Init Router
    RouterModule.forRoutes(appRoutes),
    // Init Raven
    RavenModule.forRoot(),

    UserModule,
    DemoModule,
  ],
})
export class ApplicationModule implements NestModule {

  public configure(consumer: MiddlewaresConsumer): void {
    // We apply AuthMiddleware globally and then set access right with guards.
    consumer.apply(AuthMiddleware)
    .forRoutes({ path: '*' });
  }
}
