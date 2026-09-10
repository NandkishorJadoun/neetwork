import { prisma } from "../../configs/prisma.js";

export const findAllPost = async (
  userId: string,
  limit: number,
  isFollowingTab: boolean,
  cursor?: string,
) => {

  return prisma.post.findMany({
    ...(isFollowingTab
      ? {
        where: {
          OR: [
            {
              userId,
            },
            {
              author: {
                followers: {
                  some: {
                    senderId: userId,
                    status: "ACCEPTED",
                  },
                },
              },
            },
          ],
        },
      }
      : {}),
    ...(cursor
      ? {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }
      : {}),
    take: limit,
    orderBy: {
      created_at: "desc",
    },
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
  });
}

export const insertPost = async (
  userId: string,
  content: string
) => {
  return prisma.post.create({
    data: {
      userId,
      text: content,
    },
  });
}

export const findPostById = async (
  userId: string,
  postId: string
) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        orderBy: {
          created_at: "desc",
        },
        include: {
          author: {
            omit: {
              email: true,
              emailVerified: true,
              about: true,
              isAnonymous: true,
            },
          },
        },
      },
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
  });
}

export const removePostById = async (
  userId: string,
  postId: string
) => {
  return prisma.post.delete({
    where: {
      id: postId,
      userId,
    },
  })
}

export const findPostsById = async (
  userId: string,
  viewerId: string
) => {
  return prisma.post.findMany({
    where: {
      userId: viewerId
    },
    orderBy: {
      created_at: "desc",
    },
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
  })
}