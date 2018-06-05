import { StorageEntity } from './storage.entity';

export interface IStorageService {
  destroy(entity: StorageEntity): Promise<void>;
}
