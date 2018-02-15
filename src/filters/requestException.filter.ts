import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions';
import { RequestException } from '../exceptions/request.exception';
import { Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(RequestException)
export class RequestExceptionFilter implements ExceptionFilter {

  public catch(exception: RequestException, res: Response): void {
    res.status(HttpStatus.BAD_REQUEST).send(exception);
  }
}
