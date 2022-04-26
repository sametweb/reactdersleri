-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "playlistId" INTEGER;

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
