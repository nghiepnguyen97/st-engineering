/**
 * Interface
 */
interface IErrorObject{
    code: string;
    message: string;
}

export interface IPaginateResponse<T = any[]> {
    current: number,
    pages: number,
    total: number,
    data: T
}

/**
 * CustomResponse
 */
export default class CustomResponse {
    error: boolean = false;
    data: any;
    errors: IErrorObject[] = [];

    /**
     * Constructor
     * @param data
     * @param errors
     * @param params
     * @param lang
     */
    constructor(data?: any, errors?: any) {
        if (errors) {
            this.error = true;
            this.errors = errors;
        } else {
            this.data = data
        }
    }
}
