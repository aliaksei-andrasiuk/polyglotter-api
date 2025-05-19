/*
  Warnings:

  - Made the column `sourcePrefix` on table `PhraseMapping` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PhraseMapping" ALTER COLUMN "sourceRoot" SET DATA TYPE TEXT,
ALTER COLUMN "sourcePrefix" SET NOT NULL,
ALTER COLUMN "sourcePrefix" SET DEFAULT '',
ALTER COLUMN "sourcePrefix" SET DATA TYPE TEXT,
ALTER COLUMN "sourceWord" SET DATA TYPE TEXT,
ALTER COLUMN "targetPhrase" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "PhraseMapping_sourceWord_idx" ON "PhraseMapping"("sourceWord");

-- CreateIndex
CREATE INDEX "PhraseMapping_sourceWord_sourcePrefix_idx" ON "PhraseMapping"("sourceWord", "sourcePrefix");

-- CreateIndex
CREATE INDEX "PhraseMapping_wordId_idx" ON "PhraseMapping"("wordId");
