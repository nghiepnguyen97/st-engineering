/**
 * Import libraries
 */
import { Response } from 'express';

/**
 * Import utils
 */
import CustomResponse from './response';

/**
 * Import constant
 */
import { SUCCESS_REQUEST, BAD_REQUEST_ERROR, INTERNAL_SERVER_ERROR } from './constants';

/**
 * HttpResponse
 */
export class HttpResponse {
    /**
     * Return success with data
     * @param res
     * @param data
     */
    static success(res: Response, data: any = null): Response {
        const obj = new CustomResponse(data);
        return res.status(SUCCESS_REQUEST).json(obj);
    }

    /**
     * Return bad request error with codes
     * @param res
     * @param errors
     */
    static badRequest(res: Response, errors?: any): Response {
        const obj = new CustomResponse(null, errors);
        return res.status(BAD_REQUEST_ERROR).json(obj);
    }

    /**
     * Return internal server error with codes
     * @param res
     * @param errors
     * @param params
     */
    static internalServer(res: Response): Response {
        const obj = new CustomResponse(null, 'system.internal.error');
        return res.status(INTERNAL_SERVER_ERROR).json(obj);
    }
}

/**
 * DataResponse
 */
export class DataResponse {
    /**
     * Return error object with code and message
     * @param errors
     */
    static errors(errors?: any): CustomResponse {
        return new CustomResponse(null, errors);
    }

    /**
     * Return success
     * @param data
     */
    static success(data?: any): CustomResponse {
        return new CustomResponse(data);
    }
}
