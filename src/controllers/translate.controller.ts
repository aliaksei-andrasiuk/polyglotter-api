// import { SearchConfigsModel } from '../models'
// import { ConflictError, ICreateSearchConfig } from '../types';

export const processAndTranslate = async (text: string) => {
    console.log('text', text.substring(0, 10));
    return [
        {
            originalLine: 'In short',
            translatedLine: 'Вкратце',
        },
        {
            originalLine: 'source code',
            translatedLine: 'исходный код',
        },
        {
            originalLine: 'Making API call',
            translatedLine: 'Вызов API',
        },
        {
            originalLine: 'software required',
            translatedLine: 'необходимое программное обеспечение',
        },
        {
            originalLine: 'notepad. manifest.json is the',
            translatedLine: 'блокнот. manifest.json это',
        }
    ];
};
