import CsvFileHelper from '../../../utils/csv-file';
import { IPaginateResponse } from '../../../utils/response/response';
import { IFileData } from './interfaces/data-response';
import { IGetListFilters, SearchOperationEnum } from './interfaces/filter';
import * as _ from 'lodash';
import * as fs from 'fs';

export default class FileService {
    static instance: FileService;
    /**
     * Get instance
     * @returns 
     */
    public static async getInstance(): Promise<FileService> {
        if (!FileService.instance) {
            FileService.instance = new FileService();
        }

        return FileService.instance;
    }

    /**
     * Get list
     * @returns 
     */
    public async getList(filePath: string, filters: IGetListFilters): Promise<IPaginateResponse<IFileData[]>> {
        const PAGE = filters.page || 1;
        const LIMIT = 20;

        if (!fs.existsSync(filePath)) {
            return null;
        }

        let fileData: IFileData[] = await CsvFileHelper.readFile(filePath);

        if (_.isEmpty(fileData)) {
            return null;
        }

        if (filters && filters.properties) {
            let search = {
                operation: null,
                value: {
                    column: null,
                    data: null
                }
            }
            if (filters.properties.search) {
                search.operation = SearchOperationEnum.Search;
                search.value = filters.properties.search;
            } else if (filters.properties.fullTextSearch) {
                search.operation = SearchOperationEnum.FullTextSearch;
                search.value = filters.properties.fullTextSearch;
            } else if (filters.properties.searchStartWith) {
                search.operation = SearchOperationEnum.SearchStartWith;
                search.value = filters.properties.searchStartWith;
            }

            if (search.operation && search.value) {
                fileData = fileData.filter(item => {
                    if (item[search.value.column] && String(item[search.value.column]).includes(search.value.data)) {
                        return item;
                    }

                    return false;
                })
            }
        }

        return {
            pages: Math.round(fileData.length / LIMIT),
            current: filters.page || 1,
            total: fileData.length,
            data: fileData.reduce((acc, current, index) => {
                if (index >= (PAGE - 1) * LIMIT && index < PAGE * LIMIT) {
                    acc.push(current)
                }
                return acc;
            }, [])
        }
    }
}

0 >= 0 && 0 < 20