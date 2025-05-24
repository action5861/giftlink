/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `thankyouMessage` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `partnerUrl` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `adminNotes` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `adminReviewed` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `imagePrompt` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Story` table. All the data in the column will be lost.
  - Added the required column `ngoId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Donation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `category` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Story` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fromStatus` on the `StoryStatusHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toStatus` on the `StoryStatusHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_storyId_fkey";

-- DropForeignKey
ALTER TABLE "StoryStatusHistory" DROP CONSTRAINT "StoryStatusHistory_storyId_fkey";

-- DropIndex
DROP INDEX "Donation_createdAt_idx";

-- DropIndex
DROP INDEX "Donation_donorId_idx";

-- DropIndex
DROP INDEX "Donation_isDeleted_idx";

-- DropIndex
DROP INDEX "Donation_itemId_idx";

-- DropIndex
DROP INDEX "Donation_status_idx";

-- DropIndex
DROP INDEX "Donation_storyId_idx";

-- DropIndex
DROP INDEX "Item_isDeleted_idx";

-- DropIndex
DROP INDEX "Item_priority_idx";

-- DropIndex
DROP INDEX "Item_storyId_idx";

-- DropIndex
DROP INDEX "Story_category_idx";

-- DropIndex
DROP INDEX "Story_partnerId_idx";

-- DropIndex
DROP INDEX "Story_status_idx";

-- DropIndex
DROP INDEX "StoryStatusHistory_changedById_idx";

-- DropIndex
DROP INDEX "StoryStatusHistory_createdAt_idx";

-- DropIndex
DROP INDEX "StoryStatusHistory_storyId_idx";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
DROP COLUMN "itemId",
DROP COLUMN "thankyouMessage",
DROP COLUMN "trackingNumber",
ADD COLUMN     "ngoId" TEXT NOT NULL,
ADD COLUMN     "paymentReference" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "deletedAt",
DROP COLUMN "imageUrl",
DROP COLUMN "isDeleted",
DROP COLUMN "partnerUrl",
DROP COLUMN "priority",
ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "coupangUrl" DROP NOT NULL,
ALTER COLUMN "coupangUrl" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "adminNotes",
DROP COLUMN "adminReviewed",
DROP COLUMN "deletedAt",
DROP COLUMN "imagePrompt",
DROP COLUMN "imageUrl",
DROP COLUMN "isDeleted",
DROP COLUMN "publishedAt",
ADD COLUMN     "recipientAddress" TEXT,
ADD COLUMN     "recipientName" TEXT,
ADD COLUMN     "recipientPhone" TEXT,
ALTER COLUMN "title" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "category" SET DATA TYPE TEXT,
ALTER COLUMN "recipientGender" SET DATA TYPE TEXT,
ALTER COLUMN "recipientRegion" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StoryStatusHistory" DROP COLUMN "fromStatus",
ADD COLUMN     "fromStatus" TEXT NOT NULL,
DROP COLUMN "toStatus",
ADD COLUMN     "toStatus" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DonationStatus";

-- DropEnum
DROP TYPE "StoryStatus";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "coupangOrderId" TEXT,
    "trackingNumber" TEXT,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProduct" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoupangPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoupangPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGO" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "settlementPeriod" TEXT NOT NULL,
    "settlementDay" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DonationToSettlement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_donationId_key" ON "Order"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "CoupangPayment_orderId_key" ON "CoupangPayment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "_DonationToSettlement_AB_unique" ON "_DonationToSettlement"("A", "B");

-- CreateIndex
CREATE INDEX "_DonationToSettlement_B_index" ON "_DonationToSettlement"("B");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoupangPayment" ADD CONSTRAINT "CoupangPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryStatusHistory" ADD CONSTRAINT "StoryStatusHistory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DonationToSettlement" ADD CONSTRAINT "_DonationToSettlement_A_fkey" FOREIGN KEY ("A") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DonationToSettlement" ADD CONSTRAINT "_DonationToSettlement_B_fkey" FOREIGN KEY ("B") REFERENCES "Settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
