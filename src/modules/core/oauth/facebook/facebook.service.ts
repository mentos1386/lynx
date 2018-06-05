import { Injectable } from '@nestjs/common';
import { Facebook, FacebookApiException } from 'fb';
import { FacebookLoginDTO } from './facebook.interface';
import { IOAuth } from '../oauth.interface';
import { InvalidTokenException } from '../../authentication/invalidToken.exception';

@Injectable()
export class OAuthFacebookService implements IOAuth<FacebookLoginDTO, any> {

  private client: any;

  private readonly FACEBOOK_ID = process.env.FACEBOOK_ID;
  private readonly FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;

  constructor() {
    this.client = new Facebook({
      version: 'v2.4',
      appId: this.FACEBOOK_ID,
      appSecret: this.FACEBOOK_SECRET,
    });
  }

  /**
   * FIXME: It should reject/resolve based on response!!
   * @param {string} accessToken
   * @returns {Promise<any>}
   */
  public verifyToken(accessToken: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.client.api('me', { fields: 'id,name', access_token: accessToken }, (res) => {
      });
    });

  }

  /**
   * Get facebook user information
   * @param {string} accessToken
   * @returns {Promise<FacebookLoginDTO>}
   */
  public async getUserInfo(accessToken: string): Promise<FacebookLoginDTO> {

    try {
      this.client.setAccessToken(accessToken);
      return this.client.api(
        '/me',
        { fields: ['id', 'name', 'email', 'picture'] }) as FacebookLoginDTO;
    } catch (err) {
      throw new InvalidTokenException();
    }
  }

  /**
   * Get facebook user's profile picture
   * @param {string} fbUserId
   * @returns {Promise<string>}
   */
  public async profilePicture(fbUserId: string): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      this.client.api(
        `/${fbUserId}/picture`,
        { height: 170, width: 170, redirect: false },
        (response) => {
          if (response && !response.error) return resolve(response.data.url);
          return reject(response.error);
        },
      ));
  }

}
