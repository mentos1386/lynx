import { StorageEngine } from 'multer';
import { Component } from '@nestjs/common';

@Component()
export abstract class AbstractStorageEngine {

  protected abstract readonly provider: StorageEngine;

  public get storageEngine(): StorageEngine {
    return this.provider;
  }
}
