-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "realName" BOOLEAN NOT NULL DEFAULT false,
    "address" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting.userId_unique" ON "Setting"("userId");

-- AddForeignKey
ALTER TABLE "Setting" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
