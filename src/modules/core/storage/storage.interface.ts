import { StorageEntity } from './storage.entity';
import { STORAGE_TYPE } from './storage.constants';

export interface IStorageService {
  destroy(entity: StorageEntity): Promise<void>;
}

export interface IStorageInterceptorOptions {
  fieldName: string;
  filter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error, accept: boolean) => void,
  ) => void;
  storageType: STORAGE_TYPE;
}
