-- CreateTable
CREATE TABLE "Conversations" (
    "id" SERIAL NOT NULL,
    "users" TEXT[],

    PRIMARY KEY ("id")
);
