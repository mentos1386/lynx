import { STORAGE_DISK_PROVIDER } from './disk.constants';
import * as multer from 'multer';
import * as path from 'path';

export const diskStorageProvider = {
  provide: STORAGE_DISK_PROVIDER,
  useFactory: () => {
    const STORAGE_DISK_PATH = process.env.STORAGE_DISK_PATH;

    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, STORAGE_DISK_PATH);
      },
      filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        // [fieldName]-[date].[ext]
        cb(null, `${file.fieldname}-${Date.now()}${extension}`);
      },
    });
  },
};
