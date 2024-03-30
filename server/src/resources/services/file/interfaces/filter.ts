export enum SearchOperationEnum {
    Search = 'search',
    FullTextSearch = 'fullTextSearch',
    SearchStartWith = 'searchStartWith'
}

interface IPaginationFilters {
    page: number,
    limit: number,
    sortBy?: string;
    sortType?: string;
}

interface ISearch {
    column: string,
    data: any
}

export interface IGetListFilters extends IPaginationFilters {
    properties: {
        [key in SearchOperationEnum]: ISearch
    }
}