/*
  Warnings:

  - You are about to drop the column `transactionHash` on the `Enrollment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Enrollment_transactionHash_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "transactionHash";
