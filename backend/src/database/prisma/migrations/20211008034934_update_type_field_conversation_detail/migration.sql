/*
  Warnings:

  - Added the required column `type` to the `ConversationDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConversationDetails" ADD COLUMN     "type" TEXT NOT NULL;
