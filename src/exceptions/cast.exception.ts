import { RequestException } from './request.exception';

export class CastException extends RequestException {
  code = 5;

  constructor(public field: string, public castType: string, data: any = {}) {
    super();
    this.message = `${this.field} could not be cast to ${this.castType}`;
    this.data = data;
  }
}
