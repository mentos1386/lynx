import { HttpException, HttpStatus } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';

export class UserBlockedException extends HttpException {
  constructor() {
    super(
      createHttpExceptionBody(
        'Your account has been suspended',
        'USER_BLOCKED_EXCEPTION',
        HttpStatus.FORBIDDEN),
      HttpStatus.FORBIDDEN,
    );
  }
}
