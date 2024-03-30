
import * as fs from 'fs';
import csvParser = require('csv-parser');
import ConvertHelper from '../convert-helper';

/**
 * CsvFileHelper
 */
export default class CsvFileHelper {
    /**
     * Read file
     * @param file 
     * @returns 
     */
    public static async readFile<T>(fileName: string): Promise<T[]> {
        try {
            let results: T[] = [];
            return new Promise((resolve, reject) => {
                let stream = fs.createReadStream(fileName);
                stream.pipe(csvParser()).on('data', (row) => results.push(<T>ConvertHelper.convert(row))).on('end', () => {
                    resolve(results);
                });
            })
        } catch (e) {
            // error here
        }
    }
}