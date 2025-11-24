/*
  Warnings:

  - You are about to drop the column `isActive` on the `DictionaryBundle` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `DictionaryBundle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[env,sourceLanguageId,targetLanguageId,version]` on the table `DictionaryBundle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `env` to the `DictionaryBundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `DictionaryBundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sha256` to the `DictionaryBundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeBytes` to the `DictionaryBundle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Environment" AS ENUM ('dev', 'prod');

-- CreateEnum
CREATE TYPE "public"."LanguageCode" AS ENUM ('pl', 'en');

-- DropIndex
DROP INDEX "public"."DictionaryBundle_sourceLanguageId_targetLanguageId_isActive_idx";

-- DropIndex
DROP INDEX "public"."DictionaryBundle_sourceLanguageId_targetLanguageId_version_key";

-- AlterTable
ALTER TABLE "public"."DictionaryBundle" DROP COLUMN "isActive",
DROP COLUMN "url",
ADD COLUMN     "env" "public"."Environment" NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "isLatest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sha256" VARCHAR(64) NOT NULL,
ADD COLUMN     "sizeBytes" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "DictionaryBundle_env_sourceLanguageId_targetLanguageId_isLa_idx" ON "public"."DictionaryBundle"("env", "sourceLanguageId", "targetLanguageId", "isLatest");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryBundle_env_sourceLanguageId_targetLanguageId_vers_key" ON "public"."DictionaryBundle"("env", "sourceLanguageId", "targetLanguageId", "version");

CREATE UNIQUE INDEX one_latest_per_pair
ON "DictionaryBundle" ("env", "sourceLanguageId", "targetLanguageId")
WHERE "isLatest" = true;
