import * as crypto from 'crypto';
import * as mime from 'mime-types';
import { Column, PrimaryColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class File {

  @PrimaryColumn()
  url: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column()
  path: string;

  @Column({ default: false })
  assigned: boolean;

  static createFilename(extension: string): string {
    const name = crypto.createHash('sha1')
    .update(Date.now() + '' + Math.random())
    .digest('hex');

    return name + extension;
  }

  static createPath(destination: string, extension: string): string {
    return (destination + File.createFilename(`.${extension}`))
    .replace(/\\/g, '/');
  }

  createUrl(): void {
    this.url = `//${process.env.API_HOST}${process.env.API_HOST}${process.env.API_PORT ? ':' : ''}${process.env.API_PORT}/${this.path}`;
  }

  createPath(destination: string): void {
    // TODO: What to do if extension is not valid?
    const extension = mime.extension(this.mimetype) || '.noext';
    this.path = File.createPath(destination, extension);
  }
}
