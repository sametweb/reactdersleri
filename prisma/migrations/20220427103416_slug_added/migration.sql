/*
  Warnings:

  - Added the required column `slug` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;
