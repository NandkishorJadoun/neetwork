/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_toId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Follow";

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "likes"("userId", "postId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_toId_fkey" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
