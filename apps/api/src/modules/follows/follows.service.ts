import { prisma } from "../../configs/prisma.js";

export const findUserFollowers = async (userId: string) => {
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

export const findUserFollowings = async (userId: string) => {
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

export const createFollowRequest = async (
  senderId: string,
  receiverId: string) => {
  return prisma.follow.create({
    data: {
      senderId,
      receiverId
    },
  });
}

export const unfollowUser = async (
  senderId: string,
  receiverId: string) => {
  return prisma.follow.delete({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId
      }
    },
  });
}

export const findAllFollowRequests = async (userId: string) => {
  return await prisma.follow.findMany({
    where: {
      receiverId: userId,
      status: "PENDING"
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

export const updateFollowRequest = async (
  senderId: string,
  receiverId: string
) => {
  return prisma.follow.update({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId
      },
      status: "PENDING",
    },
    data: {
      status: "ACCEPTED",
    },
  });
}

export const deleteFollowRequest = async (
  senderId: string,
  receiverId: string
) => {
  return prisma.follow.delete({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId
      },
      status: "PENDING",
    },
  });
}

export const removeFollowerById = async (
  senderId: string,
  receiverId: string
) => {
  return prisma.follow.delete({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId
      },
      status: "ACCEPTED",
    },
  });
}