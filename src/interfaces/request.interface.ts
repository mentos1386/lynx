import { Request } from 'express';
import { User } from '../modules/user/user.entity';

export interface IRequest extends Request {
  user: User;
  impersonatedById: number;
}
