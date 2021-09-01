-- CreateTable
CREATE TABLE "ProductType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductType.type_unique" ON "ProductType"("type");
