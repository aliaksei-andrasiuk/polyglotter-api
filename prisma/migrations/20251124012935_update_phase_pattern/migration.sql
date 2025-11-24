/*
  Warnings:

  - A unique constraint covering the columns `[sourceLanguageId,targetLanguageId,anchorText,prefixText,sourcePhraseId,sourceLemmaId,targetPhraseId,targetLemmaId]` on the table `PhrasePattern` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetLanguageId` to the `PhrasePattern` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PhrasePattern" ADD COLUMN     "anchorIndex" INTEGER,
ADD COLUMN     "targetLanguageId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PhrasePattern_sourceLanguageId_targetLanguageId_anchorText__key" ON "public"."PhrasePattern"("sourceLanguageId", "targetLanguageId", "anchorText", "prefixText", "sourcePhraseId", "sourceLemmaId", "targetPhraseId", "targetLemmaId");

-- AddForeignKey
ALTER TABLE "public"."PhrasePattern" ADD CONSTRAINT "PhrasePattern_targetLanguageId_fkey" FOREIGN KEY ("targetLanguageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
