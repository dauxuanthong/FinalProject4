/*
  Warnings:

  - Made the column `updateAt` on table `AuctionPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AuctionPost" ADD COLUMN     "buyItNow" TEXT,
ALTER COLUMN "updateAt" SET NOT NULL;
