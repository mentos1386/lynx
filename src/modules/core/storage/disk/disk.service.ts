import { IStorageService } from '../storage.interface';
import { StorageEntity } from '../storage.entity';
import { Component } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Component()
export class StorageDiskService implements IStorageService {

  private readonly STORAGE_DISK_PATH = process.env.STORAGE_DISK_PATH;

  public async destroy(entity: StorageEntity): Promise<void> {
    await new Promise((resolve, reject) => {
      fs.unlink(
        // If we change ENV->STORAGE_DISK_PATH after save, this will fail
        path.join(this.STORAGE_DISK_PATH, entity.key),
        err => err ? reject(err) : resolve(),
      );
    });
  }

}
