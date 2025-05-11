/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PhraseMapping" (
    "phraseId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "sourceRoot" VARCHAR(100) NOT NULL,
    "sourcePrefix" VARCHAR(100),
    "sourceWord" VARCHAR(100) NOT NULL,
    "targetPhrase" VARCHAR(255) NOT NULL,
    "wordsCount" SMALLINT NOT NULL,

    CONSTRAINT "PhraseMapping_pkey" PRIMARY KEY ("phraseId")
);
