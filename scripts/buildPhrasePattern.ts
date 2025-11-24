import { PhraseMapping, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalize(text: string): string {
    return text.trim().toLowerCase();
}

function splitTokens(text: string): string[] {
    return normalize(text).split(/\s+/g).filter(Boolean);
}

async function main() {
    console.log("Building PhrasePattern from PhraseMapping...");

    const langPl = await prisma.language.findUnique({ where: { code: "pl" } });
    const langEn = await prisma.language.findUnique({ where: { code: "en" } });

    if (!langPl || !langEn) {
        throw new Error("Languages pl/en not found. Run prisma db seed first.");
    }

    const batchSize = 500;
    let lastPhraseId: string | null = null;

    let total = 0;
    let created = 0;
    let skipped = 0;

    while (true) {
        const mappings: PhraseMapping[] = await prisma.phraseMapping.findMany({
            where: lastPhraseId ? { phraseId: { gt: lastPhraseId } } : undefined,
            orderBy: { phraseId: "asc" },
            take: batchSize
        });

        if (mappings.length === 0) break;

        console.log(`Batch: ${mappings.length} rows (after ${total})`);

        for (const row of mappings) {
            lastPhraseId = row.phraseId;
            total++;

            const prefixRaw = row.sourcePrefix ?? "";
            const wordRaw = row.sourceWord ?? "";
            const targetRaw = row.targetPhrase ?? "";

            const prefix = prefixRaw.trim();
            const word = wordRaw.trim();
            const target = targetRaw.trim();

            if (!word || !target) {
                skipped++;
                continue;
            }

            const anchorText = normalize(word);
            const prefixText = prefix ? normalize(prefix) : null;

            // ---------------- SOURCE SIDE (PL) ----------------
            const hasPrefix = prefix.length > 0;

            let sourcePhraseId: number | null = null;
            let sourceLemmaId: number | null = null;
            let sourcePhraseText: string | null = null;
            let anchorIndex: number | null = null;

            if (hasPrefix) {
                // Префиксная фраза
                sourcePhraseText = normalize(`${prefix} ${word}`);
            } else if (row.wordsCount > 1) {
                // Суррогатная фраза (без prefix слов не хватает)
                sourcePhraseText = normalize(word);
            }

            if (sourcePhraseText) {
                const srcPhrase = await prisma.phrase.findUnique({
                    where: {
                        languageId_text: {
                            languageId: langPl.id,
                            text: sourcePhraseText
                        }
                    }
                });

                if (!srcPhrase) {
                    skipped++;
                    continue;
                }

                sourcePhraseId = srcPhrase.id;

                // Вычисляем anchorIndex
                const tokens = splitTokens(sourcePhraseText);
                const idx = tokens.lastIndexOf(anchorText);
                anchorIndex = idx >= 0 ? idx : null;

            } else {
                // Это обычная лемма
                const lemmaText = normalize(word);
                const srcLemma = await prisma.lemma.findUnique({
                    where: {
                        languageId_text: {
                            languageId: langPl.id,
                            text: lemmaText
                        }
                    }
                });

                if (!srcLemma) {
                    skipped++;
                    continue;
                }

                sourceLemmaId = srcLemma.id;
            }

            // ---------------- TARGET SIDE (EN) ----------------
            const targetIsPhrase = target.includes(" ");

            let targetPhraseId: number | null = null;
            let targetLemmaId: number | null = null;

            if (targetIsPhrase) {
                const tgtPhrase = await prisma.phrase.findUnique({
                    where: {
                        languageId_text: {
                            languageId: langEn.id,
                            text: normalize(target)
                        }
                    }
                });

                if (!tgtPhrase) {
                    skipped++;
                    continue;
                }

                targetPhraseId = tgtPhrase.id;

            } else {
                const tgtLemma = await prisma.lemma.findUnique({
                    where: {
                        languageId_text: {
                            languageId: langEn.id,
                            text: normalize(target)
                        }
                    }
                });

                if (!tgtLemma) {
                    skipped++;
                    continue;
                }

                targetLemmaId = tgtLemma.id;
            }

            // ---------------- CHECK DUPLICATE ----------------
            const exists = await prisma.phrasePattern.findFirst({
                where: {
                    sourceLanguageId: langPl.id,
                    targetLanguageId: langEn.id,
                    anchorText,
                    prefixText: prefixText ?? undefined,
                    sourcePhraseId: sourcePhraseId ?? undefined,
                    sourceLemmaId: sourceLemmaId ?? undefined,
                    targetPhraseId: targetPhraseId ?? undefined,
                    targetLemmaId: targetLemmaId ?? undefined
                }
            });

            if (exists) continue;

            // ---------------- CREATE PATTERN ----------------
            await prisma.phrasePattern.create({
                data: {
                    sourceLanguageId: langPl.id,
                    targetLanguageId: langEn.id,

                    anchorText,
                    prefixText,
                    anchorIndex,

                    sourcePhraseId,
                    sourceLemmaId,
                    targetPhraseId,
                    targetLemmaId
                }
            });

            created++;
        }

        console.log(`Processed=${total}, created=${created}, skipped=${skipped}`);
    }

    console.log(`Finished. Total=${total}, created=${created}, skipped=${skipped}`);
}

main()
    .catch(e => {
        console.error("PhrasePattern build error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
