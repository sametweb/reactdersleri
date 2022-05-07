import { prisma } from "db";

export const getPlaylistWithVideos = async (id: number) => {
  return await prisma.playlist.findUnique({
    where: { id },
    include: {
      posts: {
        where: {
          playlistId: id,
        },
      },
    },
  });
};
