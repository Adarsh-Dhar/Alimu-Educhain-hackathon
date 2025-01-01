/*
  Warnings:

  - You are about to drop the column `fundsWithdrawn` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `stakedAmount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `yieldClaimed` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "fundsWithdrawn",
DROP COLUMN "isActive",
DROP COLUMN "stakedAmount",
DROP COLUMN "teacher",
DROP COLUMN "yieldClaimed";
