import { HttpException, HttpStatus } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';

export class InvalidLoginException extends HttpException {
  constructor() {
    super(
      createHttpExceptionBody(
        'Login failed',
        'INVALID_LOGIN_EXCEPTION',
        HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST,
    );
  }
}
