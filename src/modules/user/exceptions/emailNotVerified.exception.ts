import { HttpException, HttpStatus } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';

export class EmailNotVerifiedException extends HttpException {
  constructor() {
    super(
      createHttpExceptionBody(
        'Email not verified',
        'EMAIL_NOT_VERIFIED_EXCEPTION',
        HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST,
    );
  }
}
