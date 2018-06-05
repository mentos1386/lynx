import { Module, NestModule, HttpException, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { LoggerModule } from './core/logger/logger.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { RouterModule } from 'nest-router';
import { appRoutes } from './app.routes';
import { DemoModule } from './demo/demo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RavenInterceptor({
        filters: [{
          type: HttpException, filter: (exception: HttpException) => 500 > exception.getStatus(),
        }],
      }),
    },
  ],
})
export class ApplicationModule implements NestModule {

  public configure(consumer: MiddlewareConsumer): void {
    // We apply AuthMiddleware globally and then set access right with guards.
    consumer.apply(AuthMiddleware)
    .forRoutes('*');
  }
}
