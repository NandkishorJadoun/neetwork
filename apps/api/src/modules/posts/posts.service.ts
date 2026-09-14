import { prisma } from "../../configs/prisma.js";

export async function findAllPost(userId: string, limit: number, isFollowingTab: boolean, cursor?: string) {
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

export async function insertPost(userId: string, content: string) {
  return prisma.post.create({
    data: {
      userId,
      text: content,
    },
  });
}

export async function findPostById(userId: string, postId: string) {
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

export async function removePostById(userId: string, postId: string) {
  return prisma.post.delete({
    where: {
      id: postId,
      userId,
    },
  });
}

export async function findPostsById(userId: string, viewerId: string) {
  return prisma.post.findMany({
    where: {
      userId: viewerId,
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
  });
}
