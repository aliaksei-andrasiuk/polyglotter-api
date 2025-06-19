const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sanitizeText = (value) => {
    if (value === null || value === undefined || typeof value === 'function') {
        return '';
    }
    return String(value).trim();
};

async function importCSV(filePath) {
    const rows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const clean = {};
                for (const key in data) {
                    const normalizedKey = key.trim().replace(/\uFEFF/, '');
                    clean[normalizedKey] = sanitizeText(data[key]);
                }

                const requiredFields = ['wordId', 'phraseId', 'sourceRoot', 'targetPhrase'];
                const isValid = requiredFields.every(field => clean[field] && clean[field].length > 0);

                if (!isValid) {
                    console.warn('⚠️ Пропущена строка с неполными данными:', clean);
                    return;
                }

                rows.push({
                    phraseId: clean.phraseId,
                    wordId: clean.wordId,
                    sourceRoot: clean.sourceRoot,
                    sourcePrefix: clean.sourcePrefix,
                    sourceWord: clean.sourceWord,
                    targetPhrase: clean.targetPhrase,
                    wordsCount: parseInt(clean.wordsCount, 10) || 1,
                });
            })
            .on('end', async () => {
                console.log(`🟢 Импортируется ${rows.length} записей...`);
                let success = 0;
                for (const row of rows) {
                    try {
                        // Проверка перед вставкой
                        if (typeof row.sourcePrefix !== 'string') {
                            console.warn(`[DEBUG] Неправильный sourcePrefix в ${row.phraseId}:`, row.sourcePrefix);
                            row.sourcePrefix = '';
                        }

                        const existing = await prisma.phraseMapping.findUnique({
                            where: { phraseId: row.phraseId },
                        });

                        if (existing) continue;

                        await prisma.phraseMapping.create({ data: row });
                        success++;
                    } catch (err) {
                        console.error(`❌ Ошибка при добавлении ${row.phraseId}:`, err.message);
                    }
                }
                console.log(`✅ Импорт завершён. Успешно добавлено: ${success} строк.`);
                await prisma.$disconnect();
                resolve();
            })
            .on('error', reject);
    });
}

async function run() {
    const filePath = path.resolve(__dirname, 'pl-en-dataset.csv');

    if (!fs.existsSync(filePath)) {
        console.error('❌ Файл не найден:', filePath);
        process.exit(1);
    }

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL не задан. Проверь .env файл.');
        process.exit(1);
    }

    await importCSV(filePath);
}

run();
