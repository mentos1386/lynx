import { HttpException, HttpStatus } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';

export class LastAdminException extends HttpException {
  constructor() {
    super(
      createHttpExceptionBody(
        'Cannot delete last admin',
        'LAST_ADMIN_EXCEPTION',
        HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST,
    );
  }
}
