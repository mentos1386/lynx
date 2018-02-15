import { RequestException } from '../../../exceptions/request.exception';

export class InvalidLoginCredentialsException extends RequestException {
  code: number = 12;
  message: string = `User with these credentials not found.`;
}
