const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importCSV(filePath) {
  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const clean = {};
      for (const key in data) {
        const normalizedKey = key.trim().replace(/\uFEFF/, ''); // Удаляем BOM
        clean[normalizedKey] = typeof data[key] === 'string' ? data[key].trim() : data[key];
      }

      const requiredFields = ['wordId', 'phraseId', 'sourceRoot', 'sourceWord', 'targetPhrase'];
      const isValid = requiredFields.every(field => clean[field] && clean[field].length > 0);

      if (!isValid) {
        console.warn('⚠️ Пропущена строка с неполными данными:', clean);
        return;
      }

      rows.push({
        phraseId: clean.phraseId,
        wordId: clean.wordId,
        sourceRoot: clean.sourceRoot,
        sourcePrefix: clean.sourcePrefix || null,
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
          await prisma.phraseMapping.create({ data: row });
          success++;
        } catch (err) {
          console.error(`❌ Ошибка при добавлении ${row.phraseId}:`, err.message);
        }
      }
      console.log(`✅ Импорт завершён. Успешно добавлено: ${success} строк.`);
      await prisma.$disconnect();
    });
}

importCSV('pl-en-dataset.csv');
