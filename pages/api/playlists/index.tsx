// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Playlist } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";

export const getPlaylists = async () =>
  await prisma.playlist.findMany({
    include: {
      posts: true,
    },
  });
export const addPlaylist = async (newPlaylist: Playlist) =>
  await prisma.playlist.create({
    data: newPlaylist,
  });

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
