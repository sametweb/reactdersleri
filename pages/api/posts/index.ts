// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";

export const getPosts = async () => await prisma.post.findMany();
export const addPost = async (newPost: Post) =>
  await prisma.post.create({
    data: newPost,
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | Post[]>
) {
  if (req.method === "GET") {
    const posts = await getPosts();
    res.status(200).json(posts);
  }
  if (req.method === "POST") {
    const newPost = req.body;
    const addedPost = await addPost(newPost);
    res.status(201).json(addedPost);
  }
}
