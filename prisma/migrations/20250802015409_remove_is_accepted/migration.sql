/*
  Warnings:

  - You are about to drop the column `is_reject` on the `coordinate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "coordinate" DROP COLUMN "is_reject",
ALTER COLUMN "is_accepted" DROP NOT NULL,
ALTER COLUMN "is_accepted" DROP DEFAULT;
