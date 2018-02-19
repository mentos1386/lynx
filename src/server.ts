import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { ApplicationModule } from './modules/app.module';
import { ValidatorPipe } from './modules/core/validation/validator.pipe';
import { config } from 'dotenv';
import { FormatterInterceptor } from './interceptors/formatter.interceptor';
import { UserRolesGuard } from './modules/user/guards/roles.guard';
import { LoggerModule } from './modules/core/logger/logger.module';
import { LoggerExceptionInterceptor } from './modules/core/logger/loggerException.interceptor';
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
  const loggerInterceptor = nestApp.select(LoggerModule).get(LoggerExceptionInterceptor);
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

  // Swagger
  const options = new DocumentBuilder()
  .setTitle('Lynx Framework')
  .setDescription('Lynx API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(nestApp, options);
  SwaggerModule.setup('/docs', nestApp, document);

  const server = await nestApp.listen(parseInt(process.env.API_PORT, 10));
  console.info(`Application is listening on port ${process.env.API_PORT}.`);
  return server;
}

export default bootstrap();
