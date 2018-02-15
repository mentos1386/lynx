import { RequestException } from '../../../exceptions/request.exception';

export class EmailNotVerifiedException extends RequestException {
  code: number = 14;
  message: string = 'Email not verified.';
}
