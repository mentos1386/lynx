import { Component, Inject } from '@nestjs/common';
import { STORAGE_REPOSITORY_TOKEN, STORAGE_TYPE } from './storage.constants';
import { StorageRepository } from './storage.repository';
import { StorageEntity } from './storage.entity';
import { StorageS3Service } from './s3/s3.service';
import { StorageDiskService } from './disk/disk.service';
import { EntityNotFoundException } from '../../../exceptions/entityNotFound.exception';
import { UserRepository } from '../../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Component()
export class StorageService {

  constructor(
    @InjectRepository(StorageRepository) private storageRepository: StorageRepository,
    private storageS3Service: StorageS3Service,
    private storageDiskService: StorageDiskService,
  ) {
  }

  /**
   * Remove StorageEntity
   * @param {StorageEntity} entity
   * @returns {Promise<any>}
   */
  public async remove(entity: StorageEntity): Promise<void> {

    // Remove file from storage
    switch (entity.storageType) {
      case STORAGE_TYPE.AWS_S3:
        await this.storageS3Service.destroy(entity);
        break;
      case STORAGE_TYPE.DISK:
        await this.storageDiskService.destroy(entity);
        break;
    }

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
        entity.key = file.key;
        break;
      case STORAGE_TYPE.DISK:
        entity.url = file.path;
        entity.key = file.path;
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

    if (!entity) throw new EntityNotFoundException('storageEntity');

    return entity;
  }

  /**
   * Get StorageEntity by id
   * @param {string} id
   * @return {Promise<StorageEntity>}
   */
  public async getById(id: string): Promise<StorageEntity> {
    const entity = await this.storageRepository.findOne(id);

    if (!entity) throw new EntityNotFoundException('storageEntity');

    return entity;
  }
}
