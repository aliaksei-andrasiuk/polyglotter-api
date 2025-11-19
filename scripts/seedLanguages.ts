import { PrismaClient } from "@prisma/client";
import { DEFAULT_LANGUAGES, LanguageSeed } from "./languageConfig";

const prisma = new PrismaClient();

export async function upsertLanguages(languages: LanguageSeed[]) {
    for (const lang of languages) {
        await prisma.language.upsert({
            where: { code: lang.code },
            update: { name: lang.name },
            create: {
                code: lang.code,
                name: lang.name
            }
        });
        console.log(`Language upserted: ${lang.code} (${lang.name})`);
    }
}

function parseArgs(argv: string[]) {
    const args: Record<string, string> = {};
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg.startsWith("--")) {
            const key = arg.slice(2);
            const value = argv[i + 1];
            if (value && !value.startsWith("--")) {
                args[key] = value;
                i++;
            } else {
                args[key] = "true";
            }
        }
    }
    return args;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (!args.code && !args.name) {
        console.log("No --code/--name provided. Seeding default languages (PL/EN)...");
        await upsertLanguages(DEFAULT_LANGUAGES);
        return;
    }

    if (!args.code || !args.name) {
        throw new Error("Both --code and --name are required when adding a single language");
    }

    const lang: LanguageSeed = {
        code: args.code,
        name: args.name
    };

    console.log(`Seeding single language: ${lang.code} (${lang.name})...`);
    await upsertLanguages([lang]);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
