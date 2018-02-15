import { Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class FileController {

  @Post('/v1/file/upload')
  public async uploadFile(@Req() req: any, @Res() res: Response): Promise<any> {
    res.send(req.file);
  }

}
