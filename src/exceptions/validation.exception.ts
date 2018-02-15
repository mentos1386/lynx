import { RequestException } from './request.exception';

export class ValidationException extends RequestException {
  code: number = 19;
  message: string = 'Validation error: ';

  constructor(errors: string[]) {
    super();
    this.message += errors[0];
    this.data = errors;
  }
}
