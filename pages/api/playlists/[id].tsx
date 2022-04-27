// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Playlist } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import { ErrorResponse } from "types/error";

const editPlaylist = async (id: number, newPlaylist: Partial<Playlist>) =>
  await prisma.playlist.update({
    where: { id },
    data: newPlaylist,
  });

const getPlaylist = async (id: number) =>
  await prisma.playlist.findUnique({ where: { id } });

const deletePlaylist = async (id: number) =>
  await prisma.playlist.delete({ where: { id } });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Playlist | Playlist[] | ErrorResponse>
) {
  const id = Number(req.query.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Playlist ID invalid" });
  }
  if (req.method === "PUT") {
    const newPlaylist = req.body;
    try {
      const editedPlaylist = await editPlaylist(id, newPlaylist);
      res.status(200).json(editedPlaylist);
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
  if (req.method === "GET") {
    try {
      const playlist = await getPlaylist(id);
      if (playlist) {
        res.status(200).json(playlist);
      } else {
        res.status(404).json({ message: "Playlist not found" });
      }
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
  if (req.method === "DELETE") {
    try {
      await deletePlaylist(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
}
