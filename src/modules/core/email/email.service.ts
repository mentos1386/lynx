import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Ejs from 'ejs';
import * as path from 'path';
import { IMailinSendEmailResponse, IMailinData } from './email.interface';

import 'mailin-api-node-js';
declare const Mailin;

@Injectable()
export class EmailService {

  private readonly SENDINBLUE_API = 'https://api.sendinblue.com/v2.0';

  private readonly EMAIL_FROM = process.env.EMAIL_FROM;
  private readonly EMAIL_NAME = process.env.EMAIL_NAME;
  private readonly EMAIL_KEY = process.env.EMAIL_KEY;
  private readonly EMAIL_DISABLED = process.env.EMAIL_DISABLE === 'true';

  private client;

  constructor() {
    this.client = new Mailin(this.SENDINBLUE_API, this.EMAIL_KEY);
  }

  /**
   * Render EJS Contents
   * @param {string} template
   * @param data
   * @returns {Promise}
   */
  public async renderEmail(template: string, data: any): Promise<string> {
    const renderedFile = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path.resolve('./templates/' + template), (err, file) => {
        if (err) return reject(err);
        resolve(file);
      });
    });

    return Ejs.render(renderedFile.toString(), data);
  }

  /**
   * Compose Email
   * @param {string} subject
   * @param {string} recipient
   * @param {string} template
   * @param templateData
   * @returns {Promise<IMailinSendEmailResponse>}
   */
  public async send(
    subject: string,
    recipient: string,
    template: string,
    templateData: any,
  ): Promise<IMailinSendEmailResponse> {

    const rendered = await this.renderEmail(template, templateData);

    const data: IMailinData = {
      subject,
      to: { [recipient]: recipient },
      from: [this.EMAIL_FROM, this.EMAIL_NAME],
      html: rendered,
    };

    // if we disabled emails, just return
    if (this.EMAIL_DISABLED) return {
      code: 'success',
      message: 'Email disabled',
      data: 'Email disabled.',
    };

    // send email using client
    return new Promise<IMailinSendEmailResponse>((resolve, reject) => {
      return this.client.send_email(data)
      .on('complete', data => resolve(JSON.parse(data)))
      .on('error', reject);
    });
  }

}
