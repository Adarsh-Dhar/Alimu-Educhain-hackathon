-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "teacher" SET DEFAULT '',
ALTER COLUMN "stakedAmount" SET DEFAULT 0,
ALTER COLUMN "yieldClaimed" SET DEFAULT 0,
ALTER COLUMN "fundsWithdrawn" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT true;
