import { Module, NestModule, MiddlewaresConsumer, Global } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { LoggerModule } from './core/logger/logger.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { RouterModule } from 'nest-router';
import { appRoutes } from './app.routes';
import { DemoModule } from './demo/demo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RavenModule } from './core/raven/raven.module';

@Module({
  imports: [
    LoggerModule, // Global
    AuthenticationModule, // Required for AuthMiddleware

    // Init TypeOrm
    TypeOrmModule.forRoot(),
    // Init Router
    RouterModule.forRoutes(appRoutes),

    RavenModule.forRoot('https://d0b82e2eb2ce46eeb93ac186e245d128:c1613922bc88444f8ad926b063e9a51a@sentry.io/290747'),

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
