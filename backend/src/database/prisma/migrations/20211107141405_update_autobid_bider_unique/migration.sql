/*
  Warnings:

  - A unique constraint covering the columns `[bidder]` on the table `AutoBid` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AutoBid.bidder_unique" ON "AutoBid"("bidder");
