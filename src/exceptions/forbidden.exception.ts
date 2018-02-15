import { RequestException } from './request.exception';

export class ForbiddenException extends RequestException {
  code: number = 6;
  message: 'Forbidden';

  constructor(message?: string) {
    super();
    if (message) this.message += `: ${message}`;
  }
}
