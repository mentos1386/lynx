import { Repository } from 'typeorm';
import { StorageEntity } from './storage.entity';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(StorageEntity)
export class StorageRepository extends Repository<StorageEntity> {

  /**
   * Find StorageEntity by url
   * @param {string} url
   * @returns {Promise<StorageEntity>}
   */
  public findOneByUrl(url: string): Promise<StorageEntity> {
    return this.createQueryBuilder('file')
    .where('url = :url', { url })
    .getOne();
  }

}
