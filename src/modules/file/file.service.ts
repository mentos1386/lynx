import { Component, Inject } from '@nestjs/common';
import { File } from './file.entity';
import * as fs from 'fs';
import * as request from 'request';
import * as sharp from 'sharp';
import { NotFoundException } from '../../exceptions/notFoundException';
import { MissingException } from '../../exceptions/missing.exception';
import { FILE_REPOSITORY_TOKEN } from './file.constants';
import { FileRepository } from './file.repository';

@Component()
export class FileService {

  static readonly uploadsPath: string = 'uploads/';

  constructor(
    @Inject(FILE_REPOSITORY_TOKEN) private fileRepository: FileRepository,
  ) {
  }

  /**
   * Remove file
   * FIXME: Should be refactored to removeByUrl and remove ?
   * @param {string | File} file
   * @returns {Promise<any>}
   */
  async remove(file: string | File): Promise<any> {

    let fileDoc: File;

    if (typeof file === 'string') {
      fileDoc = await this.fileRepository.findOneByUrl(file);
    } else {
      fileDoc = file;
    }

    if (!fileDoc) {
      throw new NotFoundException();
    }

    fs.unlinkSync(fileDoc.path);
    return await this.fileRepository.delete(file);
  }

  /**
   * Save Uploaded file
   * @param {File} fileData
   * @returns {Promise<File>}
   */
  async saveUploadedFile(fileData: File): Promise<File> {
    if (!fileData || !fileData.path) throw new MissingException();

    const file = new File();
    file.mimetype = fileData.mimetype;
    file.size = fileData.size;
    file.path = fileData.path.replace(/\\/g, '/');
    file.createUrl();

    return await this.fileRepository.save(file);
  }

  /**
   * Download file from url
   * @param {string} uri
   * @returns {Promise<File>}
   */
  async downloadFile(uri: string): Promise<File> {
    const file = new File();

    return new Promise<File>((resolve, reject) => {
      request.head(uri, (err, res) => {
        file.mimetype = res.headers['content-type'];
        file.size = parseInt(res.headers['content-length'], 10);
        file.createPath(FileService.uploadsPath);
        file.createUrl();

        request(uri)
        .pipe(fs.createWriteStream(file.path))
        .on('close', () => {
          this.fileRepository.save(file).then(resolve).catch(reject);
        });
      });

    });
  }

  /**
   * Resize file
   * @param {File} file
   * @param {number} width
   * @param {number} height
   * @param {boolean} assigned
   * @returns {Promise<File>}
   */
  async resize(
    file: File,
    width: number,
    height: number,
    assigned: boolean = false,
  ): Promise<File> {
    const newFile = new File();
    newFile.mimetype = 'image/jpeg';
    newFile.createPath(FileService.uploadsPath);
    newFile.assigned = assigned;

    const data = await sharp(file.path)
    .resize(width, height)
    .jpeg()
    .toFile(newFile.path);

    newFile.size = data.size;
    newFile.createUrl();
    return await this.fileRepository.save(file);
  }

  /**
   * Get file by url
   * @param {string} url
   * @returns {Promise<File>}
   */
  async get(url: string): Promise<File> {
    return await this.fileRepository.findOneById(url);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    sharp.cache(false);
  }
}
