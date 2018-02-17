import { Catch, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions';
import { Response } from 'express';
import { LoggerService } from '../modules/core/logger/logger.service';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {

  constructor(private loggerService: LoggerService) {
  }

  public catch(exception: Error, response: Response): void {
    this.loggerService.error(exception.name, exception.message);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception);
  }
}
