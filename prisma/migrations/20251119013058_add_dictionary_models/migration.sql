-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lemma" (
    "id" SERIAL NOT NULL,
    "languageId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "pos" TEXT,
    "frequency" DOUBLE PRECISION,
    "difficulty" "DifficultyLevel",

    CONSTRAINT "Lemma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordForm" (
    "id" SERIAL NOT NULL,
    "lemmaId" INTEGER NOT NULL,
    "form" TEXT NOT NULL,
    "morphTag" TEXT,

    CONSTRAINT "WordForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phrase" (
    "id" SERIAL NOT NULL,
    "languageId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT,
    "frequency" DOUBLE PRECISION,
    "difficulty" "DifficultyLevel",

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "sourceLemmaId" INTEGER,
    "sourcePhraseId" INTEGER,
    "targetLemmaId" INTEGER,
    "targetPhraseId" INTEGER,
    "confidence" DOUBLE PRECISION,
    "senseKey" TEXT,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryBundle" (
    "id" SERIAL NOT NULL,
    "sourceLanguageId" INTEGER NOT NULL,
    "targetLanguageId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "entriesCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DictionaryBundle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE INDEX "Lemma_languageId_text_idx" ON "Lemma"("languageId", "text");

-- CreateIndex
CREATE UNIQUE INDEX "Lemma_languageId_text_key" ON "Lemma"("languageId", "text");

-- CreateIndex
CREATE INDEX "WordForm_lemmaId_idx" ON "WordForm"("lemmaId");

-- CreateIndex
CREATE INDEX "WordForm_form_idx" ON "WordForm"("form");

-- CreateIndex
CREATE UNIQUE INDEX "WordForm_lemmaId_form_key" ON "WordForm"("lemmaId", "form");

-- CreateIndex
CREATE INDEX "Phrase_languageId_text_idx" ON "Phrase"("languageId", "text");

-- CreateIndex
CREATE UNIQUE INDEX "Phrase_languageId_text_key" ON "Phrase"("languageId", "text");

-- CreateIndex
CREATE INDEX "Translation_sourceLemmaId_idx" ON "Translation"("sourceLemmaId");

-- CreateIndex
CREATE INDEX "Translation_sourcePhraseId_idx" ON "Translation"("sourcePhraseId");

-- CreateIndex
CREATE INDEX "Translation_targetLemmaId_idx" ON "Translation"("targetLemmaId");

-- CreateIndex
CREATE INDEX "Translation_targetPhraseId_idx" ON "Translation"("targetPhraseId");

-- CreateIndex
CREATE INDEX "DictionaryBundle_sourceLanguageId_targetLanguageId_isActive_idx" ON "DictionaryBundle"("sourceLanguageId", "targetLanguageId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryBundle_sourceLanguageId_targetLanguageId_version_key" ON "DictionaryBundle"("sourceLanguageId", "targetLanguageId", "version");

-- AddForeignKey
ALTER TABLE "Lemma" ADD CONSTRAINT "Lemma_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordForm" ADD CONSTRAINT "WordForm_lemmaId_fkey" FOREIGN KEY ("lemmaId") REFERENCES "Lemma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_sourceLemmaId_fkey" FOREIGN KEY ("sourceLemmaId") REFERENCES "Lemma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_sourcePhraseId_fkey" FOREIGN KEY ("sourcePhraseId") REFERENCES "Phrase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_targetLemmaId_fkey" FOREIGN KEY ("targetLemmaId") REFERENCES "Lemma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_targetPhraseId_fkey" FOREIGN KEY ("targetPhraseId") REFERENCES "Phrase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DictionaryBundle" ADD CONSTRAINT "DictionaryBundle_sourceLanguageId_fkey" FOREIGN KEY ("sourceLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DictionaryBundle" ADD CONSTRAINT "DictionaryBundle_targetLanguageId_fkey" FOREIGN KEY ("targetLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
