import { prisma } from "db";

export const getPost = async (slug: string) => {
  return await prisma.post.findUnique({ where: { slug } });
};
