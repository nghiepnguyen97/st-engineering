import * as _ from 'lodash';
import * as fs from 'fs';
import CsvFileHelper from '../../../utils/csv-file';
import { IPaginateResponse } from '../../../utils/response/response';
import { IFileData } from './interfaces/data-response';
import { IGetListFilters, SearchOperationEnum } from './interfaces/filter';

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

            if (search.operation && search.operation === SearchOperationEnum.Search && search.value) {
                fileData = fileData.filter(item => {
                    if (item[search.value.column] && String(item[search.value.column]).includes(search.value.data)) {
                        return item;
                    }

                    return false;
                })
            }

            if (search.operation && search.operation === SearchOperationEnum.SearchStartWith && search.value) {
                let indexes: number[] = [];
                switch (search.value.column) {
                    case 'postId': {
                        indexes = global.postIdTree.search(search.value.data);
                        break;
                    }

                    case 'id': {
                        indexes = global.idTree.search(search.value.data);
                        break;
                    }

                    case 'name': {
                        indexes = global.nameTree.search(search.value.data);
                        break;
                    }

                    case 'email': {
                        indexes = global.emailTree.search(search.value.data);
                        break;
                    }

                    case 'body': {
                        indexes = global.bodyTree.search(search.value.data);
                        break;
                    }
                }

                fileData = !indexes.length ? [] : indexes.map(index => fileData[index]);
            }
        }

        return {
            pages: Math.ceil(fileData.length / LIMIT),
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