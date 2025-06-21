import { prisma, TranslatedItem } from '../services';

export const processAndTranslate = async (text: string): Promise<TranslatedItem[]> => {
    const dataset = await prisma.phraseMapping.findMany();
    const sourceMap = new Map<string, typeof dataset>();

    for (const entry of dataset) {
        const word = entry.sourceWord;
        const group = sourceMap.get(word);
        if (group) {
            group.push(entry);
        } else {
            sourceMap.set(word, [entry]);
        }
    }

    const tokenizedText = tokenizeText(text.toLowerCase());

    const wordPositions = new Map<string, number[]>();
    tokenizedText.forEach((word, index) => {
        if (!wordPositions.has(word)) {
            wordPositions.set(word, []);
        }
        wordPositions.get(word)!.push(index);
    });

    const seenLines = new Set<string>();
    const replacedItems: TranslatedItem[] = [];

    for (const [word, positions] of wordPositions.entries()) {
        const candidates = sourceMap.get(word);
        if (!candidates) continue;

        for (const { sourcePrefix, targetPhrase, sourceWord } of candidates) {
            const hasPrefix = sourcePrefix !== "";

            for (const pos of positions) {
                const prev = tokenizedText[pos - 1] || "";

                const isMatch = hasPrefix
                    ? (prev === sourcePrefix)
                    : true;

                if (isMatch) {
                    const originalLine = hasPrefix
                        ? `${prev} ${sourceWord}`
                        : sourceWord;

                    if (!seenLines.has(originalLine)) {
                        replacedItems.push({
                            originalLine,
                            translatedLine: targetPhrase,
                        });

                        seenLines.add(originalLine);
                    }
                }
            }
        }
    }

    return replacedItems.sort((a, b) => b.translatedLine.length - a.translatedLine.length);
};

const tokenizeText = (text: string): string[] => {
  return text.match(/(?<![A-Za-zÀ-ȳĀ-ſА-Яа-яЁёĄąĆćĘęŁłŃńŚśŹźŻż])[A-Za-zÀ-ȳĀ-ſА-Яа-яЁёĄąĆćĘęŁłŃńŚśŹźŻż']+(?![A-Za-zÀ-ȳĀ-ſА-Яа-яЁёĄąĆćĘęŁłŃńŚśŹźŻż])/g)|| [];
}
