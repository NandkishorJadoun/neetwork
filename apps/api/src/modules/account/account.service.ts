import { prisma } from "../../configs/prisma.js";

export async function findUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      about: true,
    },
  });
}

export async function updateUserInfo(userId: string, image: string | null, fullname: string, about: string | null) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(image && { image }),
      fullname,
      about,
    },
    select: {
      id: true,
      name: true,
      image: true,
      about: true,
    },
  });
}
