import { RequestException } from '../../../exceptions/request.exception';

export class InvalidTokenException extends RequestException {
  code: number = 9;
  message: string = 'Invalid token';
}
