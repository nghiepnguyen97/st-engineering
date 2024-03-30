/**
 * CsvFileHelper
 */
export default class ConvertHelper {
    /**
     * Convert
     * @param parsedInput 
     * @returns 
     */
    public static convert(parsedInput: any) {
        const convertedInput = {};
        for (const key in parsedInput) {
            if (parsedInput.hasOwnProperty(key)) {
                if (key.includes("postId")) {
                    convertedInput['postId'] = parsedInput[key]
                } else {
                    convertedInput[key] = parsedInput[key];
                }
            }
        }

        return convertedInput;
    }
}