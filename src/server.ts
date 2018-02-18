import { NestFactory, Reflector } from '@nestjs/core';
import * as express from 'express';
import * as cors from 'cors';
import { ApplicationModule } from './modules/app.module';
import { ValidatorPipe } from './modules/core/validation/validator.pipe';
import { config } from 'dotenv';
import { FormatterInterceptor } from './interceptors/formatter.interceptor';
import { UserRolesGuard } from './modules/user/guards/roles.guard';
import { LoggerModule } from './modules/core/logger/logger.module';
import { LoggerInterceptor } from './modules/core/logger/logger.interceptor';
import { UserModule } from './modules/user/user.module';

async function bootstrap(): Promise<void> {

  // Use .env to configure environment variables (process.env)
  config();

  const instance = express();
  instance.use('/public/uploads', express.static('public/uploads'));

  const nestApp = await NestFactory.create(ApplicationModule, <any>instance);

  // Enable cors
  nestApp.enableCors();

  // Interceptors
  const loggerInterceptor = nestApp.select(LoggerModule).get(LoggerInterceptor);
  nestApp.useGlobalInterceptors(
    loggerInterceptor,          // Log exceptions
    new FormatterInterceptor(), // Properly format response
  );

  // Roles
  const rolesGuard = nestApp.select(UserModule).get(UserRolesGuard);
  nestApp.useGlobalGuards(
    rolesGuard, // Set Access rights based on user roles
  );

  // Validators
  nestApp.useGlobalPipes(
    new ValidatorPipe(), // Validate inputs
  );

  const server = await nestApp.listen(parseInt(process.env.API_PORT, 10));
  console.info(`Application is listening on port ${process.env.API_PORT}.`);
  return server;
}

export default bootstrap();
