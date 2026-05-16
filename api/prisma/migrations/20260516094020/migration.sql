/*
  Warnings:

  - A unique constraint covering the columns `[fromId,toId]` on the table `follows` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "follows_fromId_toId_key" ON "follows"("fromId", "toId");
