-- CreateTable
CREATE TABLE "AuctionRoomHistory" (
    "id" SERIAL NOT NULL,
    "auctionRoomId" INTEGER NOT NULL,
    "bidTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bidAmount" TEXT NOT NULL,
    "bidder" TEXT NOT NULL,
    "tradeProduct" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuctionRoomHistory" ADD FOREIGN KEY ("auctionRoomId") REFERENCES "AuctionRooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
