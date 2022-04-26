// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "db";
import { User } from "@prisma/client";

export const getUsers = async () => await prisma.user.findMany();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | User[]>
) {
  if (req.method === "GET") {
    const users = await getUsers();
    res.status(200).json(users);
  }
}
