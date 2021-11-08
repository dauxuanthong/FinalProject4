/*
  Warnings:

  - Changed the type of `highestPrice` on the `AutoBid` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AutoBid" DROP COLUMN "highestPrice",
ADD COLUMN     "highestPrice" INTEGER NOT NULL;
