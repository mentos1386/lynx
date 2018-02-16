import { Repository } from 'typeorm';
import { File } from './file.entity';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(File)
export class FileRepository extends Repository<File> {

  /**
   * Find File by url
   * @param {string} url
   * @returns {Promise<File>}
   */
  public findOneByUrl(url: string): Promise<File> {
    return this.createQueryBuilder('file')
    .where('url = :url', { url })
    .getOne();
  }

}
