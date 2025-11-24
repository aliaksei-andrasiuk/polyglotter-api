import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalize(text: string): string {
    return text.trim().toLowerCase();
}

async function main() {
    console.log("Starting migration from PhraseMapping to Lemma/Phrase/Translation...");

    // 1. Языки pl/en должны быть уже посеяны через prisma db seed
    const langPl = await prisma.language.findUnique({ where: { code: "pl" } });
    const langEn = await prisma.language.findUnique({ where: { code: "en" } });

    if (!langPl || !langEn) {
        throw new Error("Languages 'pl' and/or 'en' not found. Run prisma db seed first.");
    }

    const batchSize = 500;
    let lastPhraseId: string | null = null;
    let totalProcessed = 0;

    console.log(`Using batch size = ${batchSize}`);

    while (true) {
        // 2. Батчево ходим по PhraseMapping, чтобы не упереться в память
        const mappings = await prisma.phraseMapping.findMany({
            where: lastPhraseId
                ? { phraseId: { gt: lastPhraseId } }
                : undefined,
            orderBy: { phraseId: "asc" },
            take: batchSize
        });

        if (mappings.length === 0) {
            break;
        }

        console.log(`Processing batch: from phraseId > ${lastPhraseId ?? "(start)"} count=${mappings.length}`);

        for (const row of mappings) {
            lastPhraseId = row.phraseId;
            const rawPrefix = row.sourcePrefix ?? "";
            const rawWord = row.sourceWord ?? "";
            const rawTarget = row.targetPhrase ?? "";

            const prefix = rawPrefix.trim();
            const word = rawWord.trim();
            const target = rawTarget.trim();

            if (!word || !target) {
                continue;
            }

            // ---------- SOURCE (PL) ----------
            let plLemmaId: number | null = null;
            let plPhraseId: number | null = null;

            const hasPrefix = prefix.length > 0;
            const isMultiWordSource = row.wordsCount > 1;

            if (hasPrefix) {
                // Есть префикс → считаем фразой: "jeśli wiesz"
                const phraseText = normalize(`${prefix} ${word}`);
                const plPhrase = await prisma.phrase.upsert({
                    where: {
                        languageId_text: {
                            languageId: langPl.id,
                            text: phraseText
                        }
                    },
                    update: {},
                    create: {
                        languageId: langPl.id,
                        text: phraseText,
                        type: "prefix_phrase" // пометим тип, чтобы потом можно было фильтровать
                    }
                });
                plPhraseId = plPhrase.id;
            } else if (isMultiWordSource) {
                // wordsCount > 1, но префикса нет — информации мало, но пусть будет "суррогатная" фраза
                const phraseText = normalize(word);
                const plPhrase = await prisma.phrase.upsert({
                    where: {
                        languageId_text: {
                            languageId: langPl.id,
                            text: phraseText
                        }
                    },
                    update: {},
                    create: {
                        languageId: langPl.id,
                        text: phraseText,
                        type: "multiword_surrogate"
                    }
                });
                plPhraseId = plPhrase.id;
            } else {
                // Обычное слово
                const lemmaText = normalize(word);
                const plLemma = await prisma.lemma.upsert({
                    where: {
                        languageId_text: {
                            languageId: langPl.id,
                            text: lemmaText
                        }
                    },
                    update: {},
                    create: {
                        languageId: langPl.id,
                        text: lemmaText
                    }
                });
                plLemmaId = plLemma.id;
            }

            // ---------- TARGET (EN) ----------
            let enLemmaId: number | null = null;
            let enPhraseId: number | null = null;

            const targetIsPhrase = target.includes(" ");

            if (targetIsPhrase) {
                const phraseText = normalize(target);
                const enPhrase = await prisma.phrase.upsert({
                    where: {
                        languageId_text: {
                            languageId: langEn.id,
                            text: phraseText
                        }
                    },
                    update: {},
                    create: {
                        languageId: langEn.id,
                        text: phraseText
                    }
                });
                enPhraseId = enPhrase.id;
            } else {
                const lemmaText = normalize(target);
                const enLemma = await prisma.lemma.upsert({
                    where: {
                        languageId_text: {
                            languageId: langEn.id,
                            text: lemmaText
                        }
                    },
                    update: {},
                    create: {
                        languageId: langEn.id,
                        text: lemmaText
                    }
                });
                enLemmaId = enLemma.id;
            }

            // ---------- TRANSLATION ----------
            const existingTranslation = await prisma.translation.findFirst({
                where: {
                    sourceLemmaId: plLemmaId ?? undefined,
                    sourcePhraseId: plPhraseId ?? undefined,
                    targetLemmaId: enLemmaId ?? undefined,
                    targetPhraseId: enPhraseId ?? undefined
                }
            });

            if (!existingTranslation) {
                await prisma.translation.create({
                    data: {
                        sourceLemmaId: plLemmaId,
                        sourcePhraseId: plPhraseId,
                        targetLemmaId: enLemmaId,
                        targetPhraseId: enPhraseId,
                        isPreferred: true
                    }
                });
            }
        }

        totalProcessed += mappings.length;
        console.log(`Total processed so far: ${totalProcessed}`);
    }

    console.log(`Migration finished. Total processed: ${totalProcessed}`);
}

main()
    .catch((e) => {
        console.error("Migration error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
