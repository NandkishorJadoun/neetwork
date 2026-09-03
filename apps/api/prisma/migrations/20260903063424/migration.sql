/*
  Warnings:

  - You are about to drop the column `fromId` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `follows` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `follows` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `follows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_fromId_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_toId_fkey";

-- DropIndex
DROP INDEX "follows_fromId_toId_key";

-- AlterTable
ALTER TABLE "follows" DROP COLUMN "fromId",
DROP COLUMN "toId",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "follows_senderId_receiverId_key" ON "follows"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
