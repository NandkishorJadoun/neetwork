/*
  Warnings:

  - You are about to drop the column `data` on the `comments` table. All the data in the column will be lost.
  - Added the required column `text` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullname` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "data",
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "fullname" SET NOT NULL;
