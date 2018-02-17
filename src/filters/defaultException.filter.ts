import { Catch, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions';
import { Response } from 'express';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {

  public catch(exception: Error, response: Response): void {
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception);
  }
}
