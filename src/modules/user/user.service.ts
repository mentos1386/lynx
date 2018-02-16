import { Component, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { OAuthGoogleService } from '../core/oauth/google/google.service';
import { OAuthFacebookService } from '../core/oauth/facebook/facebook.service';
import { EmailService } from '../core/email/email.service';
import {
  VLoginCredentials,
  VPasswordReset,
  VRegister,
  VUserQuery,
} from './user.validations';
import { User } from './user.entity';
import { StorageEntity } from '../core/storage/storage.entity';
import * as _ from 'lodash';
import { EmailExistsException } from './exceptions/emailExists.exception';
import { InvalidLoginCredentialsException } from './exceptions/invalidLoginCredentials.exception';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { InvalidTokenException } from '../core/authentication/invalidToken.exception';
import { LastAdminException } from './exceptions/lastAdmin.exception';
import { EmailNotVerifiedException } from './exceptions/emailNotVerified.exception';
import { DAuthenticatedUser } from './user.dto';
import { USER_REPOSITORY_TOKEN, USER_ROLE } from './user.constants';
import { UserRepository } from './user.repository';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { CryptoService } from '../core/crypto/crypto.service';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { StorageService } from '../core/storage/storage.service';

@Component()
export class UserService {

  private jwtSecret: string = process.env.JWT_SECRET;

  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository,
    private googleOauthService: OAuthGoogleService,
    private facebookOauthService: OAuthFacebookService,
    private emailService: EmailService,
    private storageService: StorageService,
    private authenticationService: AuthenticationService,
    private cryptoService: CryptoService,
  ) {
  }

  /**
   * Register
   * @param data
   * @returns {Promise<User>}
   */
  public async register(data: VRegister): Promise<User> {

    await this.canAddEmail(data.email);

    return await this.create({
      unverifiedEmail: data.email, password: data.password,
      profile: { name: data.name.split(' ')[0], surname: data.name.split(' ')[1] },
    });
  }

  /**
   * Login user
   * @param {VLoginCredentials} data
   * @returns {Promise<DAuthenticatedUser>}
   */
  public async login(data: VLoginCredentials): Promise<User> {

    const user = await this.userRepository.findOneByEmailOrUnverifiedEmail(data.email);

    if (!user || !user.password)
      throw new InvalidLoginCredentialsException();
    if (user.email !== data.email)
      throw new EmailNotVerifiedException();
    if (!await this.cryptoService.compare(data.password, user.password))
      throw new InvalidLoginCredentialsException();

    return user;
  }

  /**
   * Login user with google
   * @param {string} token
   * @return {Promise<{ user: User, created: boolean }>}
   */
  public async loginWithGoogle(token: string): Promise<{ user: User, created: boolean }> {

    const googleUser = await this.googleOauthService.verifyToken(token);

    let user = await this.userRepository.findOneByGoogleId(googleUser.id);
    let created = false;

    if (!user) {
      user = await this.userRepository.findOneByEmail(googleUser.email);

      if (!user) {
        const profileImageFile = await this.fileService.downloadFile(googleUser.picture);

        const userData: Partial<User> = {
          profile: { name: googleUser.name.split(' ')[0], surname: googleUser.name.split(' ')[1] },
          oauth: { google: { userId: googleUser.sub } },
          profileImage: await this.makeProfileImage(profileImageFile),
        };

        if (googleUser.email_verified) userData.email = googleUser.email;
        else userData.unverifiedEmail = googleUser.email;

        user = await this.create(userData);
        created = true;

        if (!user.email && user.unverifiedEmail) {
          await this.sendEmailVerificationToken(user.unverifiedEmail);
        }

      } else {
        // User with this email exists -> just add Google OAuth
        if (!user.profileImage.url) {
          const profilePicture = await this.fileService.downloadFile(googleUser.picture);
          user.profileImage = await this.makeProfileImage(profilePicture);
        }
        _.set(user, 'oauth.google.userId', googleUser.sub);
        await this.userRepository.save(user);
      }
    }

    return { user, created };
  }

  /**
   * Login with Facebook
   * @param {string} accessToken
   * @return {Promise<{ user: User, created: boolean }>}
   */
  public async loginWithFacebook(accessToken: string): Promise<{ user: User, created: boolean }> {

    const facebookUser = await this.facebookOauthService.getUserInfo(accessToken);

    let user = await this.userRepository.findOneByFacebookId(facebookUser.id);
    let created = false;

    if (!user) {
      if (facebookUser.email) {
        user = await this.userRepository.findOneByEmail(facebookUser.email);
      } else {
        const profilePictureUrl = await this.facebookOauthService.profilePicture(facebookUser.id);
        const profilePicture = await this.fileService.downloadFile(profilePictureUrl);

        user = await this.create({
          email: facebookUser.email,
          profile: {
            name: facebookUser.name.split(' ')[0],
            surname: facebookUser.name.split(' ')[1],
          },
          oauth: { facebook: { userId: facebookUser.id } },
          profileImage: await this.makeProfileImage(profilePicture),
        });
        created = true;
      }
    } else {
      // Email exists -> just add social login
      if (!user.profileImage) {
        const profilePictureUrl = await this.facebookOauthService.profilePicture(facebookUser.id);
        const profilePicture = await this.fileService.downloadFile(profilePictureUrl);
        user.profileImage = await this.makeProfileImage(profilePicture);
      }
      _.set(user, 'oauth.facebook.userId', facebookUser.id);
      await this.userRepository.save(user);
    }

    return { user, created };
  }

  /**
   * List users
   * @param {VUserQuery} query
   * @returns {Promise<User[]>}
   */
  public async list(query: VUserQuery) {

    const queryBuild = this.userRepository.createQueryBuilder('user')
    .where('blocked = false');

    if (query.search) {
      const search = query.search
      .replace(/['"\\();%]/g, '')
      .replace(/\s+/g, '%');

      queryBuild.andWhere(
        `(profile->>'name') || (profile->>'surname') ILIKE :search OR email ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    if (query.role) queryBuild.andWhere('role = :role', { role: query.role });
    else queryBuild.andWhere('role != :role', { role: USER_ROLE.ADMIN });

    const [rows, count] = await queryBuild.offset(query.page * query.perPage)
    .limit(query.perPage)
    .getManyAndCount();

    return { users: rows, total: count };
  }

  /**
   * Get user by id
   * @param {number} id
   * @param ignoreBlocked
   * @returns {Promise<User>}
   */
  public async get(id: number, ignoreBlocked: boolean = false): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user || (user && user.blocked && !ignoreBlocked))
      throw new UserNotFoundException();

    return user;
  }

  /**
   * Check if email si valid
   * @param {string} email
   * @returns {Promise<void>}
   */
  public async canAddEmail(email: string): Promise<void> {
    const userWithEmail = await this.userRepository.findOneByEmailOrUnverifiedEmail(email);

    if (userWithEmail) throw new EmailExistsException(email);
  }

  /**
   * Update user
   * @param {User} user
   * @param {DeepPartial<User>} entity
   * @returns {Promise<User>}
   */
  public async update(user: User, entity: DeepPartial<User>): Promise<User> {

    const emailChanged = entity.email !== user.email;
    if (emailChanged) await this.canAddEmail(entity.email);

    if (emailChanged) user.unverifiedEmail = entity.email;

    user.profile = _.omit(entity, 'email');

    await this.userRepository.save(user);

    if (user.unverifiedEmail && emailChanged) {
      await this.sendEmailVerificationToken(user.unverifiedEmail);
    }

    return user;
  }

  /**
   * Update password
   * @param {User} user
   * @param {string} password
   * @returns {Promise<void>}
   */
  public async updatePassword(user: User, password: string): Promise<void> {

    user.password = await this.cryptoService.hash(password);

    await this.userRepository.save(user);

    await this.emailService.sendPasswordChangeNotification(user.email);
  }

  /**
   * Resend verification email
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  public async resendVerificationEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneByUnverifiedEmail(email);
    if (!user) throw new UserNotFoundException();

    return this.sendEmailVerificationToken(email);
  }

  /**
   * Verify email
   * @param {string} token
   * @returns {Promise<User>}
   */
  public async verifyEmail(token: string): Promise<User> {
    const jwtObject = this.authenticationService.verify(token);

    const user = await this.userRepository.findOne(jwtObject.userId);
    if (!user) throw new InvalidTokenException();

    user.email = user.unverifiedEmail;
    user.unverifiedEmail = null;

    return await this.userRepository.save(user);
  }

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  public async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) throw new UserNotFoundException();

    const resetToken = this.authenticationService.sign(user.id, null, { expires: '1h' });
    await this.emailService.sendPasswordReset(email, resetToken);

    return true;
  }

  /**
   * Reset password
   * @param {VPasswordReset} data
   * @returns {Promise<User>}
   */
  public async resetPassword(data: VPasswordReset): Promise<User> {
    const jwtObject = this.authenticationService.verify(data.token);

    const user = await this.userRepository.findOne(jwtObject.userId);
    if (!user) throw new UserNotFoundException();

    user.password = await this.cryptoService.hash(data.password);

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Remove user by id
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new UserNotFoundException();

    if (user.role === USER_ROLE.ADMIN) {
      const count = await this.userRepository.count({ where: { type: USER_ROLE.ADMIN } });
      if (count === 1) throw new LastAdminException();
    }
    await this.userRepository.delete(user);
  }

  /**
   * Create user
   * @param {Partial<User>} data
   * @returns {Promise<User>}
   */
  public async create(data: Partial<User>): Promise<User> {
    const user = new User();

    if (data.password)
      user.password = await this.cryptoService.hash(data.password);

    await this.userRepository.save(user);

    if (user.unverifiedEmail)
      await this.sendEmailVerificationToken(user.unverifiedEmail);

    return user;
  }

  /**
   * Change profile image
   * @param {User} user
   * @param {StorageEntity} file
   * @returns {Promise<User>}
   */
  public async changeProfileImage(user: User, file: StorageEntity): Promise<User> {
    const oldImage = user.profileImage;
    user.profileImage = await this.makeProfileImage(file);

    await this.userRepository.save(user);

    if (oldImage) {
      await this.fileService.remove(oldImage).catch(console.log.bind(console));
    }

    return user;
  }

  /**
   * Create profile image from file
   * @param {StorageEntity} original
   * @returns {Promise<StorageEntity>}
   */
  public async makeProfileImage(original: StorageEntity): Promise<StorageEntity> {
    const image = await this.fileService.resize(original, 256, 256, true);
    this.fileService.clearCache();
    // Remove original file
    await this.fileService.remove(original.url);
    return image;
  }

  /**
   * Send email verification token
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  private async sendEmailVerificationToken(email: string): Promise<boolean> {
    const verificationToken = jwt.sign({ email } as object, this.jwtSecret, { expiresIn: '24h' });
    await this.emailService.sendEmailVerification(email, verificationToken);
    return true;
  }
}
