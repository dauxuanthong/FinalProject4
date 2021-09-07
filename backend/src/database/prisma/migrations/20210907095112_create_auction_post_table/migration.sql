-- CreateTable
CREATE TABLE "AuctionPost" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "typeId" INTEGER[],
    "typeDetail" TEXT,
    "quantity" INTEGER NOT NULL,
    "firstPrice" TEXT NOT NULL,
    "imageUrl" TEXT[],
    "description" TEXT NOT NULL,
    "stepPrice" TEXT NOT NULL,
    "auctionDatetime" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuctionPost" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
