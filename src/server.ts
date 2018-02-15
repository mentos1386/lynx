import { NestFactory, Reflector } from '@nestjs/core';
import * as express from 'express';
import * as cors from 'cors';
import { ApplicationModule } from './modules/app.module';
import { ValidatorPipe } from './pipes/validator.pipe';
import { config } from 'dotenv';
import { RequestExceptionFilter } from './filters/requestException.filter';
import { DefaultExceptionFilter } from './filters/defaultException.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap(): Promise<void> {
  config();
  const instance = express();

  instance.use(cors());
  instance.use('/uploads', express.static('uploads'));

  const nestApp = await NestFactory.create(ApplicationModule, instance);
  nestApp.useGlobalInterceptors(new ResponseInterceptor());
  nestApp.setGlobalPrefix('api');
  nestApp.useGlobalFilters(new RequestExceptionFilter(), new DefaultExceptionFilter());
  nestApp.useGlobalPipes(new ValidatorPipe());
  nestApp.useGlobalGuards(new RolesGuard(new Reflector()));

  const server = await nestApp.listen(parseInt(process.env.API_PORT, 10));
  console.info(`Application is listening on port ${process.env.API_PORT}.`);
  return server;
}

export default bootstrap();
