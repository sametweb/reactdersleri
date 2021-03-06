// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import makeSlug from "utils/makeSlug";

export const getPosts = async () => await prisma.post.findMany();
export const addPost = async (newPost: Post) => {
  const slug = makeSlug(newPost.title);
  newPost.slug = slug;
  return await prisma.post.create({
    data: newPost,
  });
};

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
    if (newPost.videoUrl && newPost.videoUrl.includes("youtube")) {
      const videoID = newPost.videoUrl.split("v=")[1];
      const imageUrl = `https://i.ytimg.com/vi/${videoID}/mqdefault.jpg`;
      newPost.imageUrl = imageUrl;
    }
    const addedPost = await addPost(newPost);
    res.status(201).json(addedPost);
  }
}
