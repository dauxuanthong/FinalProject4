-- CreateTable
CREATE TABLE "AuctionRooms" (
    "id" SERIAL NOT NULL,
    "auctionPostId" INTEGER NOT NULL,
    "currentPrice" TEXT NOT NULL,
    "members" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuctionRooms.auctionPostId_unique" ON "AuctionRooms"("auctionPostId");

-- AddForeignKey
ALTER TABLE "AuctionRooms" ADD FOREIGN KEY ("auctionPostId") REFERENCES "AuctionPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
