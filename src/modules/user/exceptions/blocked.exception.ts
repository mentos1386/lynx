import { RequestException } from '../../../exceptions/request.exception';

export class BlockedException extends RequestException {
  code: number = 15;
  message: string = 'Your account has been suspended.';
}
