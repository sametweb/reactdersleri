// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import { ErrorResponse } from "types/error";
import makeSlug from "utils/makeSlug";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | Post[] | ErrorResponse>
) {
  const id = Number(req.query.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "ID invalid" });
  }
  if (req.method === "PUT") {
    const newPost = req.body;
    if (newPost.videoUrl && newPost.videoUrl.includes("youtube")) {
      const videoID = newPost.videoUrl.split("v=")[1];
      const imageUrl = `https://i.ytimg.com/vi/${videoID}/mqdefault.jpg`;
      newPost.imageUrl = imageUrl;
    }
    if (newPost.title) {
      const slug = makeSlug(newPost.title);
      newPost.slug = slug;
    }
    try {
      const editedPost = await prisma.post.update({
        where: { id },
        data: newPost,
      });
      res.status(200).json(editedPost);
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
  if (req.method === "GET") {
    try {
      const post = await prisma.post.findUnique({ where: { id } });
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
  if (req.method === "DELETE") {
    try {
      await prisma.post.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
}
