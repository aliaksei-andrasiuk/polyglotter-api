-- CreateTable
CREATE TABLE "public"."PhrasePattern" (
    "id" SERIAL NOT NULL,
    "sourceLanguageId" INTEGER NOT NULL,
    "sourcePhraseId" INTEGER,
    "targetPhraseId" INTEGER,
    "sourceLemmaId" INTEGER,
    "targetLemmaId" INTEGER,
    "anchorText" TEXT NOT NULL,
    "prefixText" TEXT,

    CONSTRAINT "PhrasePattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhrasePattern_sourceLanguageId_anchorText_idx" ON "public"."PhrasePattern"("sourceLanguageId", "anchorText");

-- AddForeignKey
ALTER TABLE "public"."PhrasePattern" ADD CONSTRAINT "PhrasePattern_sourceLanguageId_fkey" FOREIGN KEY ("sourceLanguageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhrasePattern" ADD CONSTRAINT "PhrasePattern_sourcePhraseId_fkey" FOREIGN KEY ("sourcePhraseId") REFERENCES "public"."Phrase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhrasePattern" ADD CONSTRAINT "PhrasePattern_targetPhraseId_fkey" FOREIGN KEY ("targetPhraseId") REFERENCES "public"."Phrase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhrasePattern" ADD CONSTRAINT "PhrasePattern_sourceLemmaId_fkey" FOREIGN KEY ("sourceLemmaId") REFERENCES "public"."Lemma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhrasePattern" ADD CONSTRAINT "PhrasePattern_targetLemmaId_fkey" FOREIGN KEY ("targetLemmaId") REFERENCES "public"."Lemma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
