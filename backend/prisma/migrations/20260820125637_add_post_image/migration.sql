/*
  Warnings:

  - Added the required column `image` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePublicId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "imagePublicId" TEXT NOT NULL;
