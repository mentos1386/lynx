import { RequestException } from '../../../exceptions/request.exception';

export class EmailExistsException extends RequestException {
  code: number = 1;

  constructor(email: string) {
    super();
    this.message = `Email "${email}" already registered.`;
  }
}
