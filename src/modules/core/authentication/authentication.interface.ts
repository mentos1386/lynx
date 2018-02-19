import { User } from '../../user/user.entity';

export interface IJWTObject {
  userId: number;
  impersonatedById?: number;
}

export interface IAuthenticatedRequest extends Request {
  user: User;
  impersonatedById: number;
}
