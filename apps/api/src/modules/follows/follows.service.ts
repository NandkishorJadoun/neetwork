import { prisma } from "../../configs/prisma.js";

export async function findUserFollowers(userId: string) {
  return prisma.follow.findMany({
    where: {
      receiverId: userId,
      status: "ACCEPTED",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function findUserFollowings(userId: string) {
  return prisma.follow.findMany({
    where: {
      senderId: userId,
      status: "ACCEPTED",
    },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function createFollowRequest(senderId: string, receiverId: string) {
  return prisma.follow.create({
    data: {
      senderId,
      receiverId,
    },
  });
}

export async function unfollowUser(senderId: string, receiverId: string) {
  return prisma.follow.delete({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId,
      },
    },
  });
}

export async function findAllFollowRequests(userId: string) {
  return await prisma.follow.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
}

export async function updateFollowRequest(senderId: string, receiverId: string) {
  return prisma.follow.update({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId,
      },
      status: "PENDING",
    },
    data: {
      status: "ACCEPTED",
    },
  });
}

export async function deleteFollowRequest(senderId: string, receiverId: string) {
  return prisma.follow.delete({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId,
      },
      status: "PENDING",
    },
  });
}

export async function removeFollowerById(senderId: string, receiverId: string) {
  return prisma.follow.delete({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId,
      },
      status: "ACCEPTED",
    },
  });
}
