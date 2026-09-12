import { faker } from '@faker-js/faker';
import { randomUUIDv7 } from "node:crypto"

export const createMockPost = (authorId: string) => {
    return {
        id: randomUUIDv7() as string,
        text: faker.lorem.sentence(),
        userId: authorId,
        created_at: faker.date.anytime()
    }
}

export const createMockComment = (postId: string, authorId: string) => {
    return {
        postId: postId,
        userId: authorId,
        data: faker.lorem.sentence(),
        created_at: faker.date.anytime().toISOString()
    }
}