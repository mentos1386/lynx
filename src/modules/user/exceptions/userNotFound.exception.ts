import { RequestException } from '../../../exceptions/request.exception';

export class UserNotFoundException extends RequestException {
  code: number = 3;
  message: string = 'User not found';
}
