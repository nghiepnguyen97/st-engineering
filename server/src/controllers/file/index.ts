import BaseController from '../../controllers/base';
import { NextFunction, Response, Request } from 'express';
import FileCustomResponse from './custom';
import { HttpResponse } from '../../utils/response';
import AppResource from '../../resources';
import { REDIS_KEYS } from '../../modules/redis/key';

/**
 * FileController
 */
export default class FileController extends BaseController {
    /**
     * Upload
     * @param req 
     * @param res 
     * @param next 
     */
    public static async upload(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const file = req.file;

            // this will be running in the reality, need to return the response immediately, front end don't need to wait for it
            // but now just simulate the uploading process
            // FileCustomResponse.buildFileDataStructure(file);
            // return HttpResponse.success(res, true);

            const handleRsp = await FileCustomResponse.buildFileDataStructure(file);

            if (handleRsp.error) {
                return HttpResponse.success(res, handleRsp.errors);
            }

            await new Promise((res, rej) => {
                setTimeout(() => {
                    res(true);
                }, 3000)
            });

            return HttpResponse.success(res, true);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Upload
     * @param req 
     * @param res 
     * @param next 
     */
    public static async getProgress(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const APP = await AppResource.getInstance();
            return HttpResponse.success(res, await APP.mRedis.get(REDIS_KEYS.uploadProcess));
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get list
     * @param req 
     * @param res 
     * @param next 
     */
    public static async getList(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { filters } = <any>req.query;
            const response = await FileCustomResponse.handleGetList(JSON.parse(filters || null));

            if (response.error) {
                return HttpResponse.badRequest(res, response.errors);
            }

            return HttpResponse.success(res, response.data);
        } catch (e) {
            next(e);
        }
    }
}
