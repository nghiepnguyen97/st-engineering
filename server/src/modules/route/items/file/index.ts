import express = require('express');
import { NextFunction } from 'express';
import * as fs from 'fs';
import { FILE_ROUTE } from '../../../../modules/route/base/file';
import Multer from '../../../../modules/multer';
import FileController from '../../../../controllers/file';

const fileRoute = express.Router();
const REQUEST = FILE_ROUTE.requests;

/* Read */
fileRoute.route(REQUEST.items.path).get(FileController.getList);
fileRoute.route(REQUEST.progress.path).get(FileController.getProgress);

/** Write */
fileRoute.route(REQUEST.upload.path).post([(req: Request, res: Response, next: NextFunction) => {
    const fileName = './file-uploads/data.csv';
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }

    next();
}, Multer.handler('./file-uploads/').single('file')], FileController.upload);

export { fileRoute };
