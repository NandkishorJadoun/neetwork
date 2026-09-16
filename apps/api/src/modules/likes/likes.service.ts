import { prisma } from "../../configs/prisma.js";

export async function findLikedPostsByUserId(userId: string, viewerId: string) {
  return prisma.like.findMany({
    where: { userId: viewerId },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
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

export async function findLikesByPostId(postId: string) {
  return prisma.like.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
  });
}

export async function insertLike(userId: string, postId: string) {
  return prisma.like.create({
    data: {
      userId,
      postId,
    },
  });
}

export async function removeLike(userId: string, postId: string) {
  return prisma.like.delete({
    where: {
      userId_postId:
      {
        userId,
        postId,
      },
    },
  });
}
