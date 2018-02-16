import { IStorageService } from '../storage.interface';
import { StorageEntity } from '../storage.entity';

export class StorageS3Service implements IStorageService {

  public async destroy(entity: StorageEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
