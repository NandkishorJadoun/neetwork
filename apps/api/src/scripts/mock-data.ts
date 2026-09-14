import { randomUUIDv7 } from "node:crypto";
import { faker } from "@faker-js/faker";

export function createMockPost(authorId: string) {
  return {
    id: randomUUIDv7() as string,
    text: faker.lorem.sentence(),
    userId: authorId,
    created_at: faker.date.anytime(),
  };
}

export function createMockComment(postId: string, authorId: string) {
  return {
    postId,
    userId: authorId,
    data: faker.lorem.sentence(),
    created_at: faker.date.anytime().toISOString(),
  };
}
