import { Request } from 'express';
import { User } from '../modules/user/user.entity';
import { File } from '../modules/core/storage/storage.entity';

export interface IRequest extends Request {
  user: User;
  impersonatedById: number;

  fileSaved: File;
  filesSaved: File[];
}
