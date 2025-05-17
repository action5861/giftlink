/*
  Warnings:

  - Added the required column `recipientRegion` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Story_isDeleted_idx";

-- DropIndex
DROP INDEX "Story_publishedAt_idx";

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "recipientRegion" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "FavoriteStory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteStory_userId_idx" ON "FavoriteStory"("userId");

-- CreateIndex
CREATE INDEX "FavoriteStory_storyId_idx" ON "FavoriteStory"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteStory_userId_storyId_key" ON "FavoriteStory"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "FavoriteStory" ADD CONSTRAINT "FavoriteStory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteStory" ADD CONSTRAINT "FavoriteStory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
