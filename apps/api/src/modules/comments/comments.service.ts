import { prisma } from "../../configs/prisma.js";

export const findCommentsByUserId = async (
  userId: string,
  viewerId: string
) => {
  return prisma.comment.findMany({
    where: {
      userId: viewerId
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      post: {
        include: {
          author: {
            select: {
              image: true,
              name: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });
}

export const insertComment = async (
  userId: string,
  postId: string,
  text: string
) => {
  return await prisma.comment.create({
    data: {
      text,
      userId,
      postId,
    },
  });

}