import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { loggerProviders } from './logger.providers';
import { LoggerInterceptor } from './logger.interceptor';

@Global()
@Module({
  components: [
    ...loggerProviders,
    LoggerService,
    LoggerInterceptor,
  ],
  exports: [
    LoggerService,
    LoggerInterceptor,
  ],
})
export class LoggerModule {
}
