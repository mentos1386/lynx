import { Component, Inject } from '@nestjs/common';
import { STORAGE_REPOSITORY_TOKEN, STORAGE_TYPE } from './storage.constants';
import { NotFoundException } from '../../../exceptions/notFoundException';
import { StorageRepository } from './storage.repository';
import { StorageEntity } from './storage.entity';

@Component()
export class StorageService {

  constructor(
    @Inject(STORAGE_REPOSITORY_TOKEN) private storageRepository: StorageRepository,
  ) {
  }

  /**
   * Remove StorageEntity
   * @param {StorageEntity} entity
   * @returns {Promise<any>}
   */
  public async remove(entity: StorageEntity): Promise<void> {
    await this.storageRepository.delete(entity);
  }

  /**
   * Save file
   * @param {Express.MulterS3.File} file
   * @param storageType
   * @returns {Promise<StorageEntity>}
   */
  public async save(
    file: Express.MulterS3.File, // Should be `| Express.Multer.File` but it doesn't work
    storageType: STORAGE_TYPE,
  ): Promise<StorageEntity> {
    const entity = new StorageEntity();
    entity.mimetype = file.mimetype;
    entity.size = file.size;
    entity.storageType = storageType;

    // Depending on storage type used, we have to set proper url
    switch (storageType) {
      case STORAGE_TYPE.AWS_S3:
        entity.url = file.location;
        break;
      case STORAGE_TYPE.DISK:
        entity.url = file.path;
        break;
    }

    return await this.storageRepository.save(entity);
  }

  /**
   * Get StorageEntity by url
   * @param {string} url
   * @returns {Promise<StorageEntity>}
   */
  public async getByUrl(url: string): Promise<StorageEntity> {
    const entity = await this.storageRepository.findOneByUrl(url);

    if (!entity) throw new NotFoundException('storageEntity');

    return entity;
  }

  /**
   * Get StorageEntity by id
   * @param {string} id
   * @return {Promise<StorageEntity>}
   */
  public async getById(id: string): Promise<StorageEntity> {
    const entity = await this.storageRepository.findOne(id);

    if (!entity) throw new NotFoundException('storageEntity');

    return entity;
  }
}
