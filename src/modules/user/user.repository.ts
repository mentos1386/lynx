import {  Repository } from 'typeorm';
import { User } from './user.entity';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  /**
   * Find User by facebook id
   * @param {string} id
   * @returns {Promise<User>}
   */
  findOneByFacebookId(id: string): Promise<User> {
    return this.createQueryBuilder('user')
    .where('oauth->>facebook->>"userId" = :id', { id })
    .getOne();
  }

  /**
   * Find User by google id
   * @param {string} id
   * @returns {Promise<User>}
   */
  findOneByGoogleId(id: string): Promise<User> {
    return this.createQueryBuilder('user')
    .where('oauth->>google->>"userId" = :id', { id })
    .getOne();
  }

  /**
   * Find User by email
   * @param {string} email
   * @returns {Promise<User>}
   */
  findOneByEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
    .where('email = :email', { email })
    .getOne();
  }

  /**
   * Find User by unverified email
   * @param {string} email
   * @returns {Promise<User>}
   */
  findOneByUnverifiedEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
    .where('"unverifiedEmail" = :email', { email })
    .getOne();
  }

  /**
   * Find User by email or unverified email
   * @param {string} email
   * @returns {Promise<User>}
   */
  findOneByEmailOrUnverifiedEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
    .where('email = :email OR "unverifiedEmail" = :email', { email })
    .getOne();
  }

}
