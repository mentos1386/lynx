import { IStorageService } from '../storage.interface';
import { StorageEntity } from '../storage.entity';

export class StorageDiskService implements IStorageService {

  public destroy(entity: StorageEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
