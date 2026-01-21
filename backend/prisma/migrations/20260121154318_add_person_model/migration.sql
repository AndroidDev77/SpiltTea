-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "personId" TEXT;

-- AlterTable
ALTER TABLE "VettingRequest" ADD COLUMN     "targetPersonId" TEXT;

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "approximateAge" INTEGER,
    "gender" "Gender",
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'USA',
    "profileImageUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_city_state_idx" ON "Person"("city", "state");

-- CreateIndex
CREATE INDEX "Post_personId_idx" ON "Post"("personId");

-- CreateIndex
CREATE INDEX "VettingRequest_targetPersonId_idx" ON "VettingRequest"("targetPersonId");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VettingRequest" ADD CONSTRAINT "VettingRequest_targetPersonId_fkey" FOREIGN KEY ("targetPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
