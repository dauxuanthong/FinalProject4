-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "typeId" INTEGER[],
    "typeDetail" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "imageUrl" TEXT[],
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post.userId_unique" ON "Post"("userId");

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
