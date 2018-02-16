import { Component, Inject } from '@nestjs/common';
import { STORAGE_REPOSITORY_TOKEN } from './storage.constants';
import { NotFoundException } from '../../../exceptions/notFoundException';
import { StorageRepository } from './storage.repository';
import { StorageEntity } from './storage.entity';

@Component()
export abstract class StorageService {

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
   * @param {Express.Multer.File} file
   * @returns {Promise<File>}
   */
  public async save(file: Express.Multer.File): Promise<StorageEntity> {
    const entity = new StorageEntity();
    entity.path = file.path;
    entity.mimetype = file.mimetype;
    entity.size = file.size;

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
