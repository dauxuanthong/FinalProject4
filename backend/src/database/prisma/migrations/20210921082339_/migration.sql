/*
  Warnings:

  - A unique constraint covering the columns `[users]` on the table `Conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversations.users_unique" ON "Conversations"("users");
