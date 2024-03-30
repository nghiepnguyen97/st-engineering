import * as _ from 'lodash';
import * as crypto from 'crypto-js';
import CustomResponse from '../../utils/response/response';
import CsvFileHelper from '../../utils/csv-file';
import { IGetListFilters } from '../../resources/services/file/interfaces/filter';
import AppResource from '../../resources';
import { DataResponse } from '../../utils/response';
import { IFileData } from '../../resources/services/file/interfaces/data-response';
import { CONFIGS } from '../../modules/global/variable';
import { REDIS_KEYS } from '../../modules/redis/key';

/**
 * FileCustomResponse
 */
export default class FileCustomResponse {

    /**
     * Is valid file data
     * @param fileData 
     * @returns 
     */
    public static isValidFileData(fileData: IFileData): boolean {
        return !(
            (fileData.postId && typeof Number(fileData.postId) === 'number') &&
            (fileData.id && typeof Number(fileData.id) === 'number') &&
            typeof fileData.name === 'string' &&
            typeof fileData.email === 'string' &&
            typeof fileData.body === 'string'
        );
    }

    /**
     * Build file data structure
     * @param file 
     * @returns 
     */
    public static async buildFileDataStructure(file: Express.Multer.File): Promise<CustomResponse> {
        const APP = await AppResource.getInstance();
        try {
            await APP.mRedis.set(REDIS_KEYS.uploadProcess, 'processing');
            const fileData = await CsvFileHelper.readFile<IFileData>(file.path);

            if (_.isEmpty(fileData)) {
                return DataResponse.errors('File is empty');
            }

            if (this.isValidFileData(fileData[0])) {
                return DataResponse.errors('File is invalid');
            }

            await APP.mRedis.set(REDIS_KEYS.uploadProcess, 'complete');

            return DataResponse.success();
            // File done stored
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * Handle get list
     * @param filters 
     * @returns 
     */
    public static async handleGetList(filters: IGetListFilters): Promise<CustomResponse> {
        const APP = await AppResource.getInstance();
        try {
            const filtersKey = crypto.MD5(JSON.stringify(filters)).toString();
            const cachingData = await APP.mRedis.get(filtersKey);

            if (!_.isEmpty(cachingData)) {
                return DataResponse.success(cachingData);
            }

            const filePath = `${CONFIGS.server.fileUpload}/data.csv`;
            const fileData = await APP.svFile.getList(filePath, filters);

            if (!_.isEmpty(fileData)) {
                await APP.mRedis.set(filtersKey, fileData);
            }
            return DataResponse.success(fileData);
        } catch (e) {
            throw new Error(e);
        }
    }
}