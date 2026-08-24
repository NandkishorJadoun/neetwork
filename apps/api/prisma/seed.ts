import { prisma } from "../src/libs/prisma"
import { createMockUser, createMockPost } from "../src/scripts/mock-data";

const mockUsers = Array.from({ length: 5 }).map(() => createMockUser());
const mockPosts = mockUsers.flatMap(user => Array.from({ length: 2 }).map(() => createMockPost(user.id)))

const main = async () => {
    try {
        await prisma.post.deleteMany({})
        await prisma.user.deleteMany({})
        await prisma.user.createMany({ data: mockUsers })
        await prisma.post.createMany({ data: mockPosts })

    } catch (error) {
        console.error(error)
    }
}

main()