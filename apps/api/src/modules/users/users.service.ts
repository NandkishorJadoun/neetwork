import { prisma } from "../../configs/prisma.js";

export async function findNonFollowingUsers(userId: string) {
  return prisma.user.findMany({
    where: {
      id: { not: userId },
      followers: {
        none: { senderId: userId },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
}

export async function findUserProfile(userId: string, viewerId: string) {
  return prisma.user.findUnique({
    where: {
      id: viewerId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      about: true,

      _count: {
        select: {
          followers: {
            where: {
              status: "ACCEPTED",
            },
          },
          followings: {
            where: {
              status: "ACCEPTED",
            },
          },
        },
      },

      followers: {
        where: {
          senderId: userId,
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          status: true,
        },
      },
    },
  });
}
