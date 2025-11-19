export type LanguageSeed = {
    code: string;
    name: string;
};

export const DEFAULT_LANGUAGES: LanguageSeed[] = [
    { code: "pl", name: "Polski" },
    { code: "en", name: "English" }
];
