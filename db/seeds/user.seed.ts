import * as faker from 'faker';
import { UserService } from '../../src/modules/user/user.service';
import { USER_REPOSITORY_TOKEN } from '../../src/modules/user/user.constants';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../src/modules/user/user.repository';
import { VRegister } from '../../src/modules/user/user.validations';
import { DAuthenticatedUser } from '../../src/modules/user/user.dto';

export class UserSeed {

  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository,
    private userService: UserService,
  ) {
  }

  async seed(num: number = 5): Promise<DAuthenticatedUser[]> {

    /* Users */
    const users = await Promise.all(new Array(num).map(a => this.registerUser()));

    await this.verifyAllUsers();

    console.log([
      `Done. Seeded:`,
      ` - ${num} users`,
    ].join('\n'));

    return users;
  }

  /**
   * Register user
   * @param {string} emailDomain
   * @returns {Promise<DAuthenticatedUser>}
   */
  async registerUser(emailDomain?: string) {
    const userData: VRegister = {
      email: faker.internet.email(null, null, emailDomain),
      password: 'password',
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
    };

    return await this.userService.register(userData);
  }

  /**
   * Verify all users
   * @returns {Promise<void>}
   */
  async verifyAllUsers() {
    // language=PostgreSQL
    await this.userRepository.query(`
      UPDATE "User"
      SET "email" = "unverifiedEmail", "unverifiedEmail" = NULL
      WHERE "unverifiedEmail" IS NOT NULL
    `);
  }
}
