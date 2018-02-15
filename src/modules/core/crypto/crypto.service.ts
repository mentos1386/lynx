import { Component } from '@nestjs/common';
import * as argon2 from 'argon2';

@Component()
export class CryptoService {

  private readonly type = argon2.argon2id;

  constructor() {
  }

  /**
   * Compare hash
   * @param {string} plain
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  public async compare(plain: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plain);
  }

  /**
   * Generate hash
   * @param {string} plain
   * @returns {Promise<string>}
   */
  public async hash(plain: string): Promise<string> {
    return await argon2.hash(plain, { type: this.type });
  }
}
