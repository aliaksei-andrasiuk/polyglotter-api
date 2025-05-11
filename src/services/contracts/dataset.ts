export interface DatasetItem {
    phraseId: string;
    wordId: string;
    sourceRoot: string;
    sourcePrefix: string | null;
    sourceWord: string;
    targetPhrase: string;
    wordsCount: number;
};
