import * as fs from 'fs';
import * as _ from 'lodash';
import multer = require('multer');

/**
 * Multer
 */
export default class Multer {
    public static tmpUploadPath = './../../file-uploads';

    /**
     * handler
     */
    public static handler(dest?: string): any {
        let config = {
            limits: {
                fileSize: 1 * 1024 * 1024 * 1024 // 1GB
            },
            storage: undefined
        }

        if (!_.isEmpty(dest)) {
            config.storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, dest)
                },
                filename: function (req, file, cb) {
                    req.on('error', (error) => {
                        const fullFileName = `${dest}${file.originalname}`;
                        console.log('Upload file ' + fullFileName + ' error: ', error);
                        fs.unlinkSync(fullFileName)
                    });
                    cb(null, file.originalname);
                }
            });
        }

        return multer(config);
    }

}