// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Playlist } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import makeSlug from "utils/makeSlug";

export const getPlaylists = async () =>
  await prisma.playlist.findMany({
    include: {
      posts: true,
    },
  });
export const addPlaylist = async (newPlaylist: Playlist) => {
  const slug = makeSlug(newPlaylist.title);
  newPlaylist.slug = slug;
  return await prisma.playlist.create({
    data: newPlaylist,
  });
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Playlist | Playlist[]>
) {
  if (req.method === "GET") {
    const playlists = await getPlaylists();
    res.status(200).json(playlists);
  }
  if (req.method === "POST") {
    const newPlaylist = req.body;
    const addedPlaylist = await addPlaylist(newPlaylist);
    res.status(201).json(addedPlaylist);
  }
}
