-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twitterHandle" TEXT,
ADD COLUMN     "igHandle" TEXT,
ADD COLUMN     "tiktokHandle" TEXT;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "twitterHandle" TEXT,
ADD COLUMN     "igHandle" TEXT,
ADD COLUMN     "tiktokHandle" TEXT;
