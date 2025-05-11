import { prisma, TranslatedItem } from '../services';

export const processAndTranslate = async (text: string): Promise<TranslatedItem[]> => {

    const dataset = await prisma.phraseMapping.findMany();

    const seen = new Set<string>();
    const replacedItems: TranslatedItem[] = [];
    const tokenizedText = tokenizeText(text);

    for (let index = 0; index < dataset.length; index++) {
        const { sourcePrefix, sourceWord, targetPhrase, phraseId } = dataset[index];

        const wordIndex = tokenizedText.findIndex((word) => word.toLowerCase() === sourceWord);
        const phrase = (wordIndex && tokenizedText[wordIndex - 1] === sourcePrefix) || (wordIndex && tokenizedText[wordIndex + 1] === sourcePrefix) ? targetPhrase : null;

        if (phrase && !seen.has(phraseId)) {
            replacedItems.push({
                originalLine: `${tokenizedText[wordIndex - 1]} ${sourceWord}`,
                translatedLine: phrase,
            });

            seen.add(phraseId);
        }
    }

    return replacedItems;
};

const tokenizeText = (text: string): string[] => {
  return text.match(/\b[\p{L}']+\b/gu) || [];
}
