import { Injectable } from '@nestjs/common';
import { OAuth } from 'oauth';
import * as google from 'googleapis';
import { IGooglePlusResponse } from './google.interface';
import { IOAuth } from '../oauth.interface';
import { InvalidTokenException } from '../../authentication/invalidToken.exception';

@Injectable()
export class OAuthGoogleService implements IOAuth<IGooglePlusResponse, any> {

  private client: any;
  private readonly GOOGLE_ID = process.env.GOOGLE_ID;
  private readonly GOOGLE_SECRET = process.env.GOOGLE_SECRET;
  private readonly GOOGLE_REDIRECT = process.env.GOOGLE_REDIRECT;

  constructor() {
    const OAuth2 = google.auth.OAuth2;

    this.client = new OAuth2(this.GOOGLE_ID, this.GOOGLE_SECRET, this.GOOGLE_REDIRECT);
  }

  /**
   * Verifies with Google that the token passed is valid Google user token
   * @param {string} token
   * @returns {Promise<any>}
   */
  public verifyToken(token: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.client.verifyIdToken(
        token,
        this.GOOGLE_ID,
        (e, login) => {
          if (e) return reject(e);
          const payload = login.getPayload();
          resolve(payload);
        });

    }).catch(() => {
      throw new InvalidTokenException();
    });
  }

  /**
   * Get token user details
   * @param {string} accessToken
   * @returns {Promise<IGooglePlusResponse>}
   */
  public getUserInfo(accessToken: string): Promise<IGooglePlusResponse> {

    this.client.setCredentials({
      access_token: accessToken,
    });

    const plus = google.plus('v1');

    return new Promise((resolve, reject) => {
      plus.people.get(
        {
          userId: 'me',
          auth: this.client,
        },
        (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
    });
  }

}
