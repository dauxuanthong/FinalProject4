-- CreateTable
CREATE TABLE "AutoBid" (
    "id" SERIAL NOT NULL,
    "auctionRoomId" INTEGER NOT NULL,
    "bidder" TEXT NOT NULL,
    "highestPrice" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutoBid" ADD FOREIGN KEY ("auctionRoomId") REFERENCES "AuctionRooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
