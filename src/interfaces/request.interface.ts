import { Request } from 'express';
import { User } from '../modules/user/user.entity';
import { File } from '../modules/file/file.entity';

export interface IRequest extends Request {
  user: User;
  impersonatedById: number;

  fileSaved: File;
  filesSaved: File[];
}
